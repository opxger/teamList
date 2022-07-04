public with sharing class fetchTeams {
    @AuraEnabled (cacheable=true)
    public static List<NBA__c> getAllTeams(){
    try {
        return[SELECT team_name__c,wins__c,losses__c,ppg__c,opp_ppg__c,	conference__c FROM NBA__C];
        }
     catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
  }
    //!needs to be @AuraEnabled, can be cached and needs to have public Static