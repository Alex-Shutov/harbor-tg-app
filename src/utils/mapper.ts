
type MappingConfig<T> = {
  [K in keyof T]: string;
};

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

export function mapDto<T>(data: any, mapping: MappingConfig<T> | null): T {
  if (!mapping) {
    return data as T; // Если mapping === null, возвращаем исходные данные
  }

  const result = {} as T;

  for (const key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      result[key] = getValueByPath(data, mapping[key]);
    }
  }

  return result;
}

