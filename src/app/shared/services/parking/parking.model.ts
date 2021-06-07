export class TicketModel {
    public code?: string;
    public data: TicketDataModel = {};
}

export class TicketDataModel {
    public date?: number;
    public position?: number;
    public paymentDate?: number;
    public paymentOption?: number;
}

