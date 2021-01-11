export default class HeaderEntity {
    public text: string = '';
    public align: string = '';
    public sortable: boolean = false;
    public value: string = '';
    public type?: string = '';

    constructor(text: string, align: string, sortable: boolean, value: string, type?: string) {
        this.text = text;
        this.align = align;
        this.sortable = sortable;
        this.value = value;
        this.type = type || '';
    }
}
