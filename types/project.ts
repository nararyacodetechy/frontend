export type Client = {
    id: number;
    name: string;
  };
  
export type Project = {
    id: number;
    name: string;
    imageUrl: string;
    clientId: number;
    client: string;
    description: string;
    deadline: Date;
    createdAt: Date;
    statusProgress: string;
    statusPayment: string;
  };
  