import { EventEmitter } from 'events';

export class Events {
    private static instance: Events;

    private eventEmitter: EventEmitter;

    private constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public static getInstance(): Events {
        if (!Events.instance) {
            Events.instance = new Events();
        }
        return Events.instance;
    }

    public getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }
}
