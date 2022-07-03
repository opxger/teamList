import { LightningElement } from 'lwc';

export default class Pagination extends LightningElement {

    previousHandler(e){
        this.dispatchEvent(new CustomEvent('previous'))
    }
    nextHandler(e){
        this.dispatchEvent(new CustomEvent('next'))
    }
    firstHandler(e){
        this.dispatchEvent(new CustomEvent('first'))
    }
    lastHandler(e){
        this.dispatchEvent(new CustomEvent('last'))
    }
}