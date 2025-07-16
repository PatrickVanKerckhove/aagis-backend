// src/service/_handleDBError.ts
import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {
  
  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_archeosite_naam_unique'):
        throw ServiceError.validationFailed(
          'An archeosite with this name already exists',
        );
      case message.includes('idx_marker_naam_unique'):
        throw ServiceError.validationFailed(
          'A marker with this name already exists',
        );  
      case message.includes('idx_user_email_unique'):
        throw ServiceError.validationFailed(
          'There is already a user with this email address',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_marker_site'):
        throw ServiceError.notFound('This archeosite does not exist');
      case message.includes('fk_marker_wende'):
        throw ServiceError.notFound('This wende does not exist'); 
      case message.includes('fk_wende_site'):
        throw ServiceError.notFound('This archeosite does not exist');
      case message.includes('archeosite'):
        throw ServiceError.notFound('No archeosite with this id exists');
      case message.includes('wende'):
        throw ServiceError.notFound('No wende with this id exists');
      case message.includes('marker'):
        throw ServiceError.notFound('No marker with this id exists');  
      case message.includes('user'):
        throw ServiceError.notFound('No user with this id exists');
    }
  }

  if (code === 'P2003') {
    switch (true) {
      case message.includes('siteId'):
        throw ServiceError.conflict(
          'This archeosite does not exist or is still linked to wendes/markers',
        );  
      case message.includes('wendeId'):
        throw ServiceError.conflict(
          'This wende does not exist or is still linked to a marker',
        );
    }
  }

  // Rethrow error because we don't know what happened
  throw error;
};

export default handleDBError;
