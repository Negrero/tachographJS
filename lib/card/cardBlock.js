/**
 * Created by negrero on 06/03/2016.
 */
var BCDtoString=require('../util/util').BCDtoString
var calibrationPurpose=require('../util/util').calibrationPurpose
var eventFaultRecordPurpose=require('../util/util').eventFaultRecordPurpose
var eventFaultType=require('../util/util').eventFaultType
var regionNumeric=require('../util/util').regionNumeric
var entryTypeDailyWorkPeriod=require('../util/util').entryTypeDailyWorkPeriod
var toBytesBitString=require('../util/util').toBytesBitString
var equipmentType=require('../util/util').equipmentType
var toBytesNumber=require('../util/util').toBytesNumber
var nationNumeric=require('../util/util').nationNumeric


module.exports.cardBlock=function(f){
    var start=0
    var fid,tipo,long
    while(start< f.length){
        fid=toBytesNumber(f.slice(start,start+=2))
        tipo=f[start]
        start++
        long=toBytesNumber(f.slice(start,start+=2))
            if(f[start]>0x00 && f[start]<0x006){
                switch (f[start]){
                    case 0x0002:
                        console.log("resumen")
                        break
                    case 0x0005:

                        console.log("activity")
                        break
                    case 0x0501:
                        //block= new DriverCardApplicationIdentification(datos);
                        //block.setFID(Fid.EF_APPLICATION_IDENTIFICATION.toString());
                        break;
                    case 0xc100:
                        //block=new CardCertificate(datos);
                        //block.setFID(Fid.EF_CARD_CERTIFICATE.toString());
                        break;
                    case 0xc108:
                        //block=new MemberStateCertificate(datos);
                        //block.setFID(Fid.EF_CA_CERTIFICATE.toString());
                        break;
                    case 0x0520:
                        //block=new CardIdentification(datos);
                        //block.setFID(Fid.EF_IDENTIFICATION.toString());
                        break;
                    case 0x050E:
                        //block = new LastCardDownload(datos);
                        //block.setFID(Fid.EF_CARD_DOWNLOAD.toString());
                        break;
                    case 0x0521:
                        //block=new CardDrivingLicenceInformation(datos);
                        //block.setFID(Fid.EF_DRIVING_LICENSE_INFO.toString());
                        break;
                    case 0x0502:
                        //block=new CardEventData(datos);
                        //block.setFID(Fid.EF_EVENTS_DATA.toString());
                        break;
                    case 0x0503: // Faults data
                        //block=new CardFaultData(datos);
                        //block.setFID(Fid.EF_FAULTS_DATA.toString());
                        break;
                    case 0x0504: // Driver activity data
                        this.cardDriverActivity=new CardDriverActivity(f.slice)
                        //block=new CardDriverActivity(datos);
                        //block.setFID(Fid.EF_DRIVER_ACTIVITY_DATA.toString());
                        break;
                    case 0x0505:// vehicles uses
                        //block=new CardVehiclesUsed(datos);
                        //block.setFID(Fid.EF_VEHICLES_USED.toString());
                        break;
                    case 0x0506: // Places
                        //block=new CardPlaceDailyWorkPeriod(datos);
                        //block.setFID(Fid.EF_PLACES.toString());
                        break;
                    case 0x0507: // Currents usage
                        //block=new CardCurrentUse(datos);
                        //block.setFID(Fid.EF_CURRENT_USAGE.toString());
                        break;
                    case 0x0508: // Control activity data
                        //block=new CardControlActivityDataRecord(datos);
                        //block.setFID(Fid.EF_CONTROL_ACTIVITY_DATA.toString());
                        break;
                    case 0x0522:
                        //block=new SpecificConditionRecord(datos);
                        //block.setFID(Fid.EF_SPECIFIC_CONDITIONS.toString());
                        break;
            }
        }

    }

}

function CardDriverActivity(b){
    start=0
    this.activityPointerOldestDayRecord=""
    this.activityPointerNewestRecord=""
    this.activityDailyRecords=[]
}