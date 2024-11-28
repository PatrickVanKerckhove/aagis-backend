// src/data/mock_wendes.ts
import { WendeType } from '../enums/wendeType';
import { AstronomischEvent} from '../enums/astronomischEvent';

const WENDE_DATA = [
  {
    id: 1,
    siteId: 1, //Stonehenge
    wendeType: WendeType.ZomerZonnewende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2023-06-21',
    tijd: '04:52:00',
    azimuthoek: 51.3,
  },
  {
    id: 2,
    siteId: 1, //Stonehenge
    wendeType: WendeType.WinterZonnewende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2023-12-22',
    tijd: '08:09:00',
    azimuthoek: 128.05,
  },
  {
    id: 3,
    siteId: 2, //Newgrange
    wendeType: WendeType.WinterZonnewende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2023-12-21',
    tijd: '08:58:00',
    azimuthoek: 134.0,
  },
  {
    id: 4,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZomerZonnewende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2023-06-21',
    tijd: '05:28:00',
    azimuthoek: 49.34,
  },
  {
    id: 5,
    siteId: 3, //Lokeren
    wendeType: WendeType.WinterZonnewende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2023-12-22',
    tijd: '08:45:00',
    azimuthoek: 127.97,
  },
  {
    id: 6,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZomerZonnewende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2023-06-21',
    tijd: '23:02:00',
    azimuthoek: 310.67,
  },
  {
    id: 7,
    siteId: 3, //Lokeren
    wendeType: WendeType.WinterZonnewende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2023-12-22',
    tijd: '16:39:00',
    azimuthoek: 232.03,
  },
  {
    id: 8,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZuidKleineMaanwende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2015-10-18',
    tijd: '13:17:00',
    azimuthoek: 119.88,
  },
  {
    id: 9,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZuidKleineMaanwende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2015-10-18',
    tijd: '22:22:00',
    azimuthoek: 240.06,
  },
  {
    id: 10,
    siteId: 3, //Lokeren
    wendeType: WendeType.NoordKleineMaanwende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2015-10-31',
    tijd: '20:55:00',
    azimuthoek: 60.48,
  },
  {
    id: 11,
    siteId: 3, //Lokeren
    wendeType: WendeType.NoordKleineMaanwende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2015-10-31',
    tijd: '11:45:00',
    azimuthoek: 299.71,
  }, 
  {
    id: 12,
    siteId: 3, //Lokeren
    wendeType: WendeType.NoordGroteMaanwende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2006-06-25',
    tijd: '04:28:00',
    azimuthoek: 40.99,
  },
  {
    id: 13,
    siteId: 3, //Lokeren
    wendeType: WendeType.NoordGroteMaanwende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2006-06-25',
    tijd: '22:43:00',
    azimuthoek: 318.69,
  },
  {
    id: 14,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZuidGroteMaanwende,
    astronomischEvent: AstronomischEvent.Opgang,
    datum: '2006-07-09',
    tijd: '21:23:00',
    azimuthoek: 139.64,
  },
  {
    id: 15,
    siteId: 3, //Lokeren
    wendeType: WendeType.ZuidGroteMaanwende,
    astronomischEvent: AstronomischEvent.Ondergang,
    datum: '2006-07-09',
    tijd: '03:02:00',
    azimuthoek: 221.42,
  },
];
export default WENDE_DATA;
