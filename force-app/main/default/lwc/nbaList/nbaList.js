//https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation

//! only accepts default imports, need to do 1 by 1
import { LightningElement,track, wire } from 'lwc';
import getAllTeams from '@salesforce/apex/DataController.getAllTeams'

// todo: fetch column data instead of hardcode
    const columns = [
        { label: 'Team', fieldName: 'team_name__c',type:'text', sortable: true, wrapText: true, hideDefaultActions: true},
        { label: 'Wins',fieldName: 'wins__c',type: 'number',sortable: true,cellAttributes: { alignment: 'left' },hideDefaultActions: true},
        { label: 'Losses', fieldName: 'losses__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'PPG', fieldName: 'ppg__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'OPP PPG', fieldName: 'opp_ppg__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'Conference', fieldName: 'conference__c', type: 'text',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true }
    ];

    export default class DemoApp extends LightningElement {
//*Declare Variables
columns=columns;
        @track data;
        @track teams;
startingTeam=1;
firstPage=1
        @track page=1;
        @track endingTeam=0;
totalTeamCount;
        @track totalPages;
        @track pageSize=10;


//*Uses the DataController to fetch all the data. Custom controller

        @wire(getAllTeams) wiredNBA__C(res){
            if(res.data){
                this.teams=res.data
                this.totalTeamCount= res.data.length;
                this.createPage()
                // this.sorter=res.data
        }}

//*Event Handlers
        handlePrevious(e){
            if(this.page>1){
                this.page=this.page-1;
                this.handleUpdate(this.page);
            }
        }

        handleNext(e){
            if(this.page<this.totalPages){
                this.page=this.page+1
                this.handleUpdate(this.page)
            }
        }
        
        handleFirst(e){
            if(this.page!==this.firstPage){
                this.page=this.firstPage
                this.handleUpdate(this.page)
            }
        }
        handleLast(e){
            if(this.page!==this.totalPages){
                this.page=this.totalPages
                this.handleUpdate(this.page)
            }
        }

        handlePageSize(e){
            this.pageSize=e.detail.value
            this.createPage()
            this.page=this.firstPage
            this.handleUpdate(this.page)
        }

        createPage(e){
            this.totalPages = Math.ceil(this.totalTeamCount/this.pageSize);
            this.data = this.teams.slice(0,this.pageSize);
            this.endingTeam =this.pageSize;  
        }
        handleUpdate(page){
            this.startingTeam = (page-1)*this.pageSize;
            this.endingTeam = page*this.pageSize;
            this.endingTeam=this.endingTeam > this.totalTeamCount?this.totalTeamCount:this.endingTeam;
            this.data=this.teams.slice(this.startingTeam,this.endingTeam)
            this.startingTeam = this.startingTeam+1
        }


//*Sorting table columns. From the lwc docs
        defaultSortDirection = 'asc';
        sortDirection = 'asc';
        sortedBy;

        //ternary operator. Primer normalizes data? Need further research
        sortBy(field, reverse, primer) {
            const key = primer
                ? function (x) {
                      return primer(x[field]);
                  }
                : function (x) {
                      return x[field];
                  };
            return function (a, b) {
                a = key(a);
                b = key(b);
                return reverse * ((a > b) - (b > a));
            };
        }
//*Called on header click
        handleSort(e) {
            const { fieldName: sortedBy, sortDirection } = e.detail;
            const cloneData = [...this.teams];
            cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
            this.data = cloneData.slice(0,this.pageSize);
            this.sortDirection = sortDirection;
            this.sortedBy = sortedBy;
        }

    }
