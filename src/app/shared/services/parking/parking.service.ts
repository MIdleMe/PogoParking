import { Injectable } from '@angular/core';
import { TicketModel, TicketDataModel } from './parking.model';
import * as localForage from "localforage";

const parkingSpaces: number = 54;

@Injectable()
export class ParkingService {
    
    constructor() {
        localForage.config({
            driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
            name        : 'platogo',
            version     : 1.0,
            size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
            storeName   : 'parking', // Should be alphanumeric, with underscores.
            description : 'Parking information'
        });
    }

    public setTicket(): Promise<TicketModel> {
        let value: TicketDataModel = {date: Date.now()},
        key: string = crypto.getRandomValues(new Uint8Array(8)).join('').substr(0,16);
        return new Promise((resolve, reject) => {
            this.getParkedNumber().then(nParked => {
                if (nParked < parkingSpaces) {
                    this.getTicketNumber().then(nTicket => {
                            value['position'] = nTicket;
                            localForage.setItem(key, value).then(() => {
                                this.getTicket(key).then(data => {
                                    resolve(<TicketModel>data);
                                }).catch(e => {
                                    reject(e);
                                });
                            }).catch(e => {
                                reject(e);
                            });
                    }).catch(e => {
                        reject(e);
                    });
                }else {
                    reject('No available spaces');
                }
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public editTicket(key: string, value: TicketDataModel): Promise<TicketModel> {
        return new Promise((resolve, reject) => {
            this.getTicket(key).then(data => {
                let modifiedData: TicketDataModel = data.data;
                modifiedData = {...modifiedData,...value}
                localForage.setItem(key, modifiedData).then(() => {
                    resolve(<TicketModel>{code: key, data: modifiedData});
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public getTicket(key: string): Promise<TicketModel> {

        return new Promise((resolve, reject) => {
            localForage.getItem(key).then(data => {
                if (!data)
                    throw new Error('No data found');
                resolve(<TicketModel>{data:data, code:key});
            }).catch(e => {
                reject('The ticket number was not recogniced');
            });
        });
        
    }

    public getTicketByPosition(keyIndex: number): Promise<TicketModel> {

        return new Promise((resolve, reject) => {
            localForage.key(keyIndex).then(key => {
                this.getTicket(key).then(data => {
                    localForage.removeItem(key).then(() => {
                        resolve(<TicketModel>data);
                    }).catch(e => {
                        reject(e);
                    });
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public getTicketNumber(): Promise<number> {

        return new Promise((resolve, reject) => {
            localForage.keys().then(data => {
                resolve(data.length);
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public removeTicket(key: string): Promise<TicketModel> {

        return new Promise((resolve, reject) => {
            this.getTicket(key).then(data => {
                localForage.removeItem(key).then(() => {
                    resolve(<TicketModel>data);
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public clearAll(key: string): Promise<any> {

        return new Promise((resolve, reject) => {
            localForage.clear().then(() => {
                localForage.length().then(length => {
                    resolve(length);
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    public getParkedNumber(): Promise<number> {

        return new Promise((resolve, reject) => {
            let ticketList: TicketModel[] = [];
            this.getTicketList().then(dataticketList => {
                resolve(dataticketList.filter(ticket => !ticket.data.paymentDate).length);
            }).catch(e => {
                reject(e);
            });
        });
    }

    private getTicketList(): Promise<TicketModel[]> {

        return new Promise((resolve, reject) => {
            let ticketList: TicketModel[] = [];
            localForage.iterate((value, key) => {
                ticketList.push(<TicketModel>{data:value, code:key});
            }).then(data => {
                resolve(ticketList);
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    private getTicketCodeList(): Promise<string[]> {

        return new Promise((resolve, reject) => {
            localForage.keys().then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        
    }
}
