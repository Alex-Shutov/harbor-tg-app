interface EnumTransformConfig {
  paramFields?: string[];
  bodyFields?: string[];
  enumMap?: Record<string, string>;
}

const DEFAULT_ENUM_MAP = {
  establishment: 'ESTABLISHMENT',
  events: 'EVENT',
  event: 'EVENT',
  leisure: 'LEISURE',
};

export const createEnumTransformer = (config: EnumTransformConfig = {}) => {
  const {
    paramFields = ['type', 'promoCodeType', 'objectType','object_type'],
    bodyFields = ['type', 'promoCodeType', 'objectType','object_type'],
    enumMap = DEFAULT_ENUM_MAP,
  } = config;

  return (args: any): any => {
    if (!args || typeof args !== 'object') {
      return args;
    }

    const transformed = { ...args };

    // Трансформируем params
    if (transformed.params && typeof transformed.params === 'object') {
      transformed.params = { ...transformed.params };

      paramFields.forEach((field) => {
        if (field in transformed.params) {
          const value = transformed.params[field];
          if (typeof value === 'string' && value in enumMap) {
            // @ts-ignore
            transformed.params[field] = enumMap[value];
          }
        }
      });
    }

    if (transformed.data && typeof transformed.data === 'object') {
      transformed.data = { ...transformed.data };

      bodyFields.forEach((field) => {
        if (field in transformed.data) {
          const value = transformed.data[field];
          if (typeof value === 'string' && value in enumMap) {
            // @ts-ignore
            transformed.data[field] = enumMap[value];
          }
        }
      });
    }

    return transformed;
  };
};

export const enumTransformer = createEnumTransformer();
