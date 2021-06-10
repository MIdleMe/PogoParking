import { Injectable } from '@angular/core';
import { TicketModel, TicketDataModel, FareModel } from './parking.model';
import * as localForage from "localforage";

const parkingSpaces: number = 54;
const maxMinDelay: number = 15;
const fare: number = 2; // 2€ per every STARTED hour

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

    /**
     * Creates a ticket with a random barcode and current date of creation
     *
     * @returns {Promise<TicketModel>} Ticket
     * @memberof ParkingService
     * @public
     */
    public setTicket(): Promise<TicketModel> {
        let value: TicketDataModel = {date: Date.now()},
        key: string = crypto.getRandomValues(new Uint8Array(8)).join('').substr(0,16); // Random barcode of 16 digits
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

    /**
     * Modifies an exiting ticket data and returns the modified record
     *
     * @param {string} key
     * @param {TicketDataModel} value
     * @returns {Promise<TicketModel>} Ticket
     * @memberof ParkingService
     * @public
     */
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

    /**
     * Read an exiting ticket by barcode and returns it
     *
     * @param {string} barcode
     * @returns {Promise<TicketModel>} Ticket
     * @memberof ParkingService
     * @public
     */
    public getTicket(barcode: string): Promise<TicketModel> {

        return new Promise((resolve, reject) => {
            localForage.getItem(barcode).then(data => {
                if (data) {
                    resolve(<TicketModel>{data:data, code:barcode});
                } else {
                    reject('No data found');
                }
            }).catch(e => {
                reject('The ticket number was not recogniced');
            });
        });
        
    }

    /**
     * Read an exiting ticket by position and returns it
     *
     * @param {string} keyIndex
     * @returns {Promise<TicketModel>} Ticket
     * @memberof ParkingService
     * @public
     */
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

    /**
     * Calculates and returns a ticket's fare
     *
     * @param {TicketModel} ticket
     * @returns {Promise<FareModel>} Fare
     * @memberof ParkingService
     * @public
     */
    public getTicketFare(ticket: TicketModel): Promise<FareModel> {

        return new Promise((resolve, reject) => {
            let price: number = ticket.data.date ? 
                Math.trunc((Date.now() - ticket.data.date)/(3.6*10**6))  * fare // Full hours since ticket creation times fare per hour
            : 0;
            resolve(<FareModel>{ammount: price, currency: '€'});
        });

    }

    /**
     * Return the total ammount of tickets in the database
     *
     * @returns {Promise<number>} Total
     * @memberof ParkingService
     * @public
     */
    public getTicketNumber(): Promise<number> {

        return new Promise((resolve, reject) => {
            localForage.keys().then(data => {
                resolve(data.length);
            }).catch(e => {
                reject(e);
            });
        });
        
    }

    /**
     * Removes a ticket from the database and returns it
     *
     * @param {string} key
     * @returns {Promise<TicketModel>} Ticket
     * @memberof ParkingService
     * @public
     */
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

    /**
     * Removes all tickets from the database and returns current number of records (0)
     *
     * @param {string} key
     * @returns {Promise<any>} #Items
     * @memberof ParkingService
     * @public
     */
    public clearAll(): Promise<any> {

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

    /**
     * Returns current number of valid (haven't exited yet) tickets
     *
     * @returns {Promise<number>} Count
     * @memberof ParkingService
     * @public
     */
    public getParkedNumber(): Promise<number> {

        return new Promise((resolve, reject) => {
            let ticketList: TicketModel[] = [];
            this.getTicketList().then(dataticketList => {
                resolve(dataticketList.filter(ticket => !ticket.data.hasExited).length);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * Returns total number of spaces
     *
     * @returns {Promise<number>} Count
     * @memberof ParkingService
     * @public
     */
    public getParkingSpaces(): Promise<number> {

        return new Promise((resolve) => {
            resolve(parkingSpaces);
        });

    }

    /**
     * Returns the state of an existing ticket (0: Not payed, 1: Payed, 2: Has exited)
     *
     * @param {string} barcode
     * @returns {Promise<number>} State
     * @memberof ParkingService
     * @public
     */
    public getTicketState(barcode: string): Promise<number> {

        return new Promise((resolve, reject) => {
            this.getTicket(barcode).then(ticket => {
                let response = 0;
                switch (true) {
                    case ticket.data.hasExited: // Ticket registered as exited
                        response = 2;
                        break;
                    case ticket.data.paymentDate // Ticket payed and payment not expired (15min)
                        && Math.trunc((Date.now() - ticket.data.paymentDate)/(6*10**4)) <= maxMinDelay:
                        response = 1;
                        break;
                    default:
                        response = 0;
                }
                resolve(response);
            }).catch(e => {
                reject(e);
            });
        });

    }

    /**
     * Returns full list of tickets
     *
     * @param {string} barcode
     * @returns {Promise<TicketModel>} Tickets
     * @memberof ParkingService
     * @private
     */
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

    /**
     * Full list of tickets barcodes
     *
     * @returns {Promise<string[]>} Barcodes
     * @memberof ParkingService
     * @private
     */
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
