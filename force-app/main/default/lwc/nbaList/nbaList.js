//https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation

//! only accepts default imports, need to do 1 by 1
import { LightningElement,track, wire } from 'lwc';
import getAllTeams from '@salesforce/apex/DataController.getAllTeams';

// todo: fetch column data instead of hardcode
const actions = [
    { label: 'View details', name: 'view' },
    { label: 'Delete Column', name:'delete'}
];

    const columns = [
        { label: 'Logo',fieldName:'team_logo__C',type:'',sortable:false,hideDefaultActions:true},
        { label: 'Team', fieldName: 'team_name__c',type:'text', sortable: true, wrapText: true, hideDefaultActions: true},
        { label: 'Wins',fieldName: 'wins__c',type: 'number',sortable: true,cellAttributes: { alignment: 'left' },hideDefaultActions: true},
        { label: 'Losses', fieldName: 'losses__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'PPG', fieldName: 'ppg__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'OPP PPG', fieldName: 'opp_ppg__c', type: 'number',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        { label: 'Conference', fieldName: 'conference__c', type: 'text',sortable: true,cellAttributes: { alignment: 'left' }, wrapText: true, hideDefaultActions: true },
        {
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    ];

    export default class NBAApp extends LightningElement {
//*Declare Variables
columns=columns;
firstPage=1;
totalTeamCount;
//teams is used to store all items, for sorting;
teams;
        //data is used to populate the html datatable
        @track data;
        //page starts at 1 and then it can change
        @track currentPage=1;
        //first team can change depenging on which page you are on
        @track firstTeam=1;
        //the last team will change depending on page size
        @track lastTeam=10;
        //can change according to the number or records per page
        @track totalPages;
        //default page size
        @track pageSize=10;
        @track isFirstPage=true;
        @track isLastPage=false;

//*Uses the DataController to fetch all the data. Custom controller
//*Create and update
        //stores teams to be used in sorting
        //gets the length and then creates the initial page
        @wire(getAllTeams) wiredNBA__C(res){
            if(res.data){
                this.teams=res.data
                this.totalTeamCount= res.data.length;
                this.createPage()
 
        }}
        //defines the initial page size to be displayed and the data. 
        createPage(){
            this.totalPages = Math.ceil(this.totalTeamCount/this.pageSize);
            this.data = this.teams.slice(0,this.pageSize);
        }

        handleUpdate(page){
            //page will always be 2 or more. then +1 is added to get the correct item.
            this.firstTeam = (page-1)*this.pageSize;
            this.lastTeam = page*this.pageSize;
            //in case the page is not fully populated, this prevents the result from being greater than the max number of teams
            this.lastTeam=this.lastTeam > this.totalTeamCount?this.totalTeamCount:this.lastTeam;
            //refreshes data to populate the table
            this.data=this.teams.slice(this.firstTeam,this.lastTeam)
            this.firstTeam=this.firstTeam+1
        }   

//*Event Handlers
//*Pagination Buttons
        handlePrevious(){
            if(this.currentPage>=1){
                this.currentPage=this.currentPage-1;
                this.handleUpdate(this.currentPage);
                this.isLastPage=false
                this.isFirstPage=this.currentPage<=1?true:false;
            }
        }
        handleNext(){
            if(this.currentPage<=this.totalPages){
                this.currentPage=this.currentPage+1
                this.handleUpdate(this.currentPage)
                this.isFirstPage=false
                this.isLastPage=this.currentPage>=this.totalPages?true:false
            }
        }
        
        handleFirst(){
            if(this.currentPage!==this.firstPage){
                this.currentPage=this.firstPage
                this.handleUpdate(this.currentPage)
                this.isFirstPage=true
                this.isLastPage=false
            }
        }
        handleLast(){
            if(this.currentPage!==this.totalPages){
                this.currentPage=this.totalPages
                this.handleUpdate(this.currentPage)
                this.isLastPage=true
                this.isFirstPage=false
            }
        }

//*Change page size and update it
        handlePageSize(e){
            this.pageSize=e.detail.value
            this.createPage()
            this.currentPage=this.firstPage
            this.handleUpdate(this.currentPage)
            this.isFirstPage=true
        }
//TODO: Sort by full data, not just data on page. Perhaps going to first page after sort?
//*Sorting table columns. From the lwc docs
        defaultSortDirection = 'asc';
        sortDirection = 'asc';
        sortedBy;
        //Primer normalizes data? Need further research
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
//Called on header click: 
//!it will only filter the current page results, because changing pages will call the handleUpdate. Need to figure out a way to bypass
        handleSort(e) {
            const { fieldName: sortedBy, sortDirection } = e.detail;
            const cloneData = [...this.data]
            // console.log(JSON.stringify(cloneData))
            cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
            this.data = cloneData.slice(0,this.pageSize);
            this.sortDirection = sortDirection;
            this.sortedBy = sortedBy;
        }

//* Row Actions(docs)

    showRowDetails(row){
        window.alert(JSON.stringify(row));
    }
    //!Does not update the visual elements. Needs further debug
    deleteRow(row){
        const { id } =row;
        const index=this.findRowIndexId(id);
        if(index!==-1){
            this.data=this.data.slice(0,index).concat(this.data.slice(index+1));         
        }
    }

    findRowIndexId(id){
        let ret=-1;
        this.data.some((row,index)=>{
            if(row.id===id){
                ret=index;
                return true;
            } return false;
        });
        return ret;
    }

    handleRowAction(e){
        const actionName=e.detail.action.name;
        const row=e.detail.row;
        switch(actionName){
            case 'view':
                this.showRowDetails(row);
                break;
            case 'delete':
                this.deleteRow(row)
                break;
            }
        }

//todo: select checked and perform actions on them
    // handleSelection(e){

    // }
    }
