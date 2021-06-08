export class TicketModel {
    public code?: string;
    public data: TicketDataModel = {};
}

export class TicketDataModel {
    public date?: number;
    public position?: number;
    public paymentDate?: number;
    public paymentOption?: number;
    public hasExited?: boolean = false;
}

export class FareModel {
    public ammount: number = 0;
    public currency: string = '';
}

