export interface IApiTransaction {
  id: number;
  dateTime: string;
  title: string;
  description: string;
  amount: number;
  direction: 'INCREASE' | 'DECREASE';
}

export interface ITransaction {
  id: number;
  dateTime: string;
  formattedDate: string;
  title: string;
  description: string;
  amount: number;
  direction: 'INCREASE' | 'DECREASE';
  isPositive: boolean;
}

