import { v4 as uuidv4 } from 'uuid';

const assignPropertyId = (req, res, next) => {
  req.propertyId = uuidv4(); 
  next();
};

const assignProductId = (req, res, next) => {
  req.productId = uuidv4(); 
  next();
};

const assignServiceId = (req, res, next) => {
  req.serviceId = uuidv4(); 
  next();
};

export { assignPropertyId, assignServiceId, assignProductId}