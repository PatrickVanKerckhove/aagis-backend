// src/service/archeosite.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { 
  ArcheologischeSite, 
  ArcheoSiteCreateInput, 
  ArcheoSiteUpdateInput, 
  CreateArcheoSiteRequest } from '../types/archeosite';
import type { OrientatieMarker } from '../types/marker';
import type { Wende } from '../types/wende';
import { WendeType, AstronomischEvent } from '@prisma/client';
import handleDBError from './_handleDBError';
import SunCalc from 'suncalc';
import { DateTime } from 'luxon';
import geoTz from 'geo-tz';

export const getAll = async (userId: number, isAdmin: boolean) : Promise<ArcheologischeSite[]> =>{
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ServiceError.notFound('Gebruiker niet gevonden.');
  }
  if (isAdmin){
    return prisma.archeologischeSite.findMany({
      include: {
        orientatieMarkers: {
          select: {
            id: true,
            wendeId: true,
            naam: true,
            beschrijving: true,
            breedtegraad: true,
            lengtegraad: true,
            createdBy: true,
            isPublic: true,
          },
        },
        wendes: {
          select: {
            id: true,
            wendeType: true,
            astronomischEvent: true,
            datumTijd: true,
            azimuthoek: true,
            calculatedBy: true,
            createdBy: true,
            isPublic: true,
          },
        },
      },
    });
  }
  return prisma.archeologischeSite.findMany({
    where: {
      OR: [
        { createdBy: userId },
        { isPublic: true },
      ],
    },
    include: {
      orientatieMarkers: {
        select: {
          id: true,
          wendeId: true,
          naam: true,
          beschrijving: true,
          breedtegraad: true,
          lengtegraad: true,
          createdBy: true,
          isPublic: true,
        },
      },
      wendes: {
        select: {
          id: true,
          wendeType: true,
          astronomischEvent: true,
          datumTijd: true,
          azimuthoek: true,
          calculatedBy: true,
          createdBy: true,
          isPublic: true,
        },
      },
    },
  });
};

export const getById = async (id: number, userId: number, isAdmin: boolean) : Promise<ArcheologischeSite> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ServiceError.notFound('Gebruiker niet gevonden.');
  }
  const archeosite = await prisma.archeologischeSite.findUnique({
    where: { id },
    include:{
      orientatieMarkers: {
        select: {
          id: true,
          wendeId: true,
          naam: true,
          beschrijving: true,
          breedtegraad: true,
          lengtegraad: true,
          createdBy: true,
          isPublic: true,
        },
      },
      wendes: {
        select: {
          id: true,
          wendeType: true,
          astronomischEvent: true,
          datumTijd: true,
          azimuthoek: true,
          calculatedBy: true,
          createdBy: true,
          isPublic: true,
        },
      },
    },
  });
  if (!archeosite){
    throw ServiceError.notFound('Er is geen archeologische site met dit id.');
  }
  if (isAdmin || archeosite.createdBy === userId || archeosite.isPublic) {
    return archeosite;
  }
  throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
};

export const create = async (
  data : CreateArcheoSiteRequest, userId: number) 
: Promise<ArcheologischeSite> =>{
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const createData: ArcheoSiteCreateInput = {
      ...data,
      createdBy: userId,
      isPublic: false, // Standaard false
    };
    const createdSite = await prisma.archeologischeSite.create({
      data: createData,
    });
    // Automatically create wendes for zonnewendes using SunCalc and Luxon
    const lat = createdSite.breedtegraad.toNumber();
    const lon = createdSite.lengtegraad.toNumber();
    const height = createdSite.hoogte || 0;
    const tz = geoTz.find(lat, lon)[0]; // Get timezone for the location
    const currentYear = DateTime.now().year;

    // Helper function to convert SunCalc azimuth (from south) to standard azimuth (from north, 0-360 degrees)
    const getStandardAzimuth = (azimuthRadians: number): number => {
      let azDegrees = (azimuthRadians * 180 / Math.PI + 180) % 360;
      if (azDegrees < 0) azDegrees += 360;
      return parseFloat(azDegrees.toFixed(2));
    };

    // Summer solstice (approx June 21)
    const summerMidnightLocal = DateTime.fromObject({ year: currentYear, month: 6, day: 21 }, { zone: tz });
    const summerDateUTC = summerMidnightLocal.toUTC().toJSDate();
    const summerTimes = SunCalc.getTimes(summerDateUTC, lat, lon, height);

    // Sunrise summer
    const sunriseSummerUTC = summerTimes.sunrise;
    const sunriseSummerLocal = DateTime.fromJSDate(sunriseSummerUTC, { zone: 'utc' }).setZone(tz);
    const azimuthSunriseSummer = getStandardAzimuth(SunCalc.getPosition(sunriseSummerUTC, lat, lon).azimuth);

    // Sunset summer
    const sunsetSummerUTC = summerTimes.sunset;
    const sunsetSummerLocal = DateTime.fromJSDate(sunsetSummerUTC, { zone: 'utc' }).setZone(tz);
    const azimuthSunsetSummer = getStandardAzimuth(SunCalc.getPosition(sunsetSummerUTC, lat, lon).azimuth);

    // Winter solstice (approx December 21)
    const winterMidnightLocal = DateTime.fromObject({ year: currentYear, month: 12, day: 21 }, { zone: tz });
    const winterDateUTC = winterMidnightLocal.toUTC().toJSDate();
    const winterTimes = SunCalc.getTimes(winterDateUTC, lat, lon, height);

    // Sunrise winter
    const sunriseWinterUTC = winterTimes.sunrise;
    const sunriseWinterLocal = DateTime.fromJSDate(sunriseWinterUTC, { zone: 'utc' }).setZone(tz);
    const azimuthSunriseWinter = getStandardAzimuth(SunCalc.getPosition(sunriseWinterUTC, lat, lon).azimuth);

    // Sunset winter
    const sunsetWinterUTC = winterTimes.sunset;
    const sunsetWinterLocal = DateTime.fromJSDate(sunsetWinterUTC, { zone: 'utc' }).setZone(tz);
    const azimuthSunsetWinter = getStandardAzimuth(SunCalc.getPosition(sunsetWinterUTC, lat, lon).azimuth);

    // Create the wendes
    await prisma.wende.createMany({
      data: [
        {
          siteId: createdSite.id,
          wendeType: WendeType.ZOMERZONNEWENDE,
          astronomischEvent: AstronomischEvent.OPGANG,
          datumTijd: sunriseSummerLocal.toJSDate(),
          azimuthoek: azimuthSunriseSummer,
          calculatedBy: 'suncalc',
          createdBy: userId,
          isPublic: false,
        },
        {
          siteId: createdSite.id,
          wendeType: WendeType.ZOMERZONNEWENDE,
          astronomischEvent: AstronomischEvent.ONDERGANG,
          datumTijd: sunsetSummerLocal.toJSDate(),
          azimuthoek: azimuthSunsetSummer,
          calculatedBy: 'suncalc',
          createdBy: userId,
          isPublic: false,
        },
        {
          siteId: createdSite.id,
          wendeType: WendeType.WINTERZONNEWENDE,
          astronomischEvent: AstronomischEvent.OPGANG,
          datumTijd: sunriseWinterLocal.toJSDate(),
          azimuthoek: azimuthSunriseWinter,
          calculatedBy: 'suncalc',
          createdBy: userId,
          isPublic: false,
        },
        {
          siteId: createdSite.id,
          wendeType: WendeType.WINTERZONNEWENDE,
          astronomischEvent: AstronomischEvent.ONDERGANG,
          datumTijd: sunsetWinterLocal.toJSDate(),
          azimuthoek: azimuthSunsetWinter,
          calculatedBy: 'suncalc',
          createdBy: userId,
          isPublic: false,
        },
      ],
    });

    // Return the site with includes
    return await prisma.archeologischeSite.findUnique({
      where: { id: createdSite.id },
      include: {
        orientatieMarkers: {
          select: {
            id: true,
            wendeId: true,
            naam: true,
            beschrijving: true,
            breedtegraad: true,
            lengtegraad: true,
          },
        },
        wendes: {
          select: {
            id: true,
            wendeType: true,
            astronomischEvent: true,
            datumTijd: true,
            azimuthoek: true,
          },
        },
      },  
    }) as ArcheologischeSite;
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number, 
  changes : ArcheoSiteUpdateInput,
  userId: number,
  isAdmin: boolean,
) : Promise<ArcheologischeSite> => {
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const archeosite = await prisma.archeologischeSite.findUnique({ where: { id } });
    if (!archeosite) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && archeosite.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze archeologische site te wijzigen.');
    }
    if (changes.isPublic !== undefined && !isAdmin) {
      throw ServiceError.forbidden('Alleen admins kunnen isPublic wijzigen.');
    }
    return await prisma.archeologischeSite.update({
      where: { id },
      data: changes,
      include: {
        orientatieMarkers: {
          select: {
            id: true,
            wendeId: true,
            naam: true,
            beschrijving: true,
            breedtegraad: true,
            lengtegraad: true,
          },
        },
        wendes: {
          select: {
            id: true,
            wendeType: true,
            astronomischEvent: true,
            datumTijd: true,
            azimuthoek: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, userId: number, isAdmin: boolean) : Promise<void> => {
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const archeosite = await prisma.archeologischeSite.findUnique({ where: { id } });
    if (!archeosite) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && archeosite.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze archeologische site te verwijderen.');
    }
    await prisma.archeologischeSite.delete({
      where: { id },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const getMarkersBySiteId = async (
  siteId: number,
  userId: number,
  isAdmin: boolean,
): Promise<OrientatieMarker[]> =>{
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const site = await prisma.archeologischeSite.findUnique({ where: { id: siteId } });
    if (!site) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && site.createdBy !== userId && !site.isPublic) {
      throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
    }
    return prisma.orientatieMarker.findMany({
      where: { siteId },
      include: {
        site: true,
        wende: {
          select: {
            id: true,
            siteId: true,
            wendeType: true,
            astronomischEvent: true,
            datumTijd: true,
            azimuthoek: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const getWendesBySiteId = async (
  siteId: number,
  userId: number,
  isAdmin: boolean,
): Promise<Wende[]> =>{
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const site = await prisma.archeologischeSite.findUnique({ where: { id: siteId } });
    if (!site) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && site.createdBy !== userId && !site.isPublic) {
      throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
    }
    return prisma.wende.findMany({
      where: { siteId },
      include: {
        site: true,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
