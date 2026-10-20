class BasePokemon{
    private _id:number
    private _name:string
    private _url:string


    constructor(id: number, name: string, url: string) {
        this._id = id;
        this._name = name;
        this._url = url;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get formattedId():string{
        let s:string=""
        if(this.id<10){
            s+="#00"+this.id
        }else if(this.id<100){
            s+="#0"+this.id
        }else{
            s+="#"+this.id
        }
        return s
    }
    get displayName():string{
        return String(this.name).charAt(0).toUpperCase() + String(this.name).slice(1);
    }
}