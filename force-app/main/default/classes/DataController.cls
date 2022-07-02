public with sharing class DataController {
    @AuraEnabled (cacheable=true)
    public static List<NBA__c> getAllTeams(){
            return[SELECT team_name__c,wins__c,losses__c,ppg__c,opp_ppg__c,	conference__c FROM NBA__C];
        }
    }
    //!needs to be @AuraEnabled, can be cached and needs to have public Static