/**
 * Created by negrero on 13/03/2016.
 */
var start=0

module.exports=function(buffer){
    var b=block(buffer,0,{})
    console.log()
}

var block=function(buffer,i,obj){
    var name
    var fid=bytestoNumber(buffer,i,2)
    i+=2
    var typeFile=buffer[i]
    i++
    var size=bytestoNumber(buffer,i,2)
    i+=2
    console.log("fid: \%h",fid)
    if(i<buffer.length-1) {
        if (TAG[fid]) {
            name=TAG[fid].block
            obj[name] = blockProperties(TAG[fid].properties, 0, buffer, i, {},size)
        } else {
            console.error("error fid no encontrado")
        }
    }

    return i>buffer.length-1?
        obj
        :
        block(buffer,i+size,obj)
}
function execute(fn,buffer,start,size){
    //arguments[0](arguments[1],arguments[2],arguments[3])
    return fn(buffer,start,size)
}

function blockProperties(properties,i,buffer,start,obj,sizeBlock){
    var name
    if (i < properties.length) {
        name = properties[i].name
        if (properties[i].properties.length == 0) {
            // execute function wich propertie type of object bytestoString, bytestoNumber, ......
            obj[name] = execute.call(null,getFn(properties[i].type),buffer, start , properties[i].size)
        } else {
            if (properties[i].type == "Array") {
                obj[name] = propertiesArray(buffer, start, 0, sizeBlock/properties[i].size,properties[i].properties,[],properties[i].size)
            } else {
                obj[name] = blockProperties(properties[i].properties, 0, buffer, start, {})
            }
        }
    }
    return i>properties.length-1 ?
        obj:
        blockProperties(properties,i+1,buffer,start+properties[i].size,obj,sizeBlock)
}

function getFn(type){
    var fn,n
    switch (type){
        case "String":
            fn=bytestoString
            break
        case "Number":
            fn = bytestoNumber
            break
        case "Date":
            fn = bytestoDate
            break
        case "Array":
            fn = tobytesArray
            break
        case "BCDString":
            fn = BCDtoString
            break
        case "OctetString":
            fn = OctetString
            break
        case "ManufactureCode":
            fn = ManufactureCode
            break
        case "NationNumeric":
            fn = NationNumeric
            break
        case "EquipmentType":
            fn = EquipmentType
            break
        case "EventFaultType":
            fn = EventFaultType
            break

        default:
            fn="properties type not found"
            break
    }
    return fn
}
// declaration block {block: name , properties:properties [name,size,type,[properties]]}
var TAG={}
TAG[0x0002]= {block:"cardIccIdentification" ,properties:
    [   {name:"clockStop",size: size_card.CLOCKSTOP[1], type:"OctetString",properties: []},
        {name:"cardExtendedSerailNumber", size:size_card.CARDEXTENDEDSERIALNUMBER[1], type:"Object",properties: [
            {name:"serialNumber", size:size_card.SERIALNUMBER[1], type:"Number",properties: []},
            {name:"monthYear", size:size_card.MONTHYEAR[0], type:"BCDString", properties:[]},
            {name:"type",size: size_card.TYPE[0], type:"OctetString",properties: []},
            {name:"ManufacturerCode",size: size_card.MANUFACTUREDCODE[0],type: "ManufactureCode",properties: []}
        ]},
        {name:"cardAprovalNumber", size:size_card.CARDAPPROVALNUMBER[0], type:"String", properties:[]},
        {name:"cardPersonaliserId", size:size_card.CARDPERSONALISERID[0], type:"String", properties:[]},
        {name:"embedderIcAssemblerId",size: size_card.EMBEDDERICASSEMBLERID[0], type :"String",properties: []},
        {name:"icIdentifier",size: size_card.ICIDENTIFIER[0], type:"OctetString", properties:[]}]

}
TAG[0x0005]={
    block:"cardChipIdentification",properties:[
        {name:"icSerialNumber",size :size_card.ICSERIALNUMBER[0], type:"OctetString",properties:[]},
        {name:"icManufacturingReferences", size: size_card.ICMANUFACTURINGREFENCES[0], type:"OctetString",properties:[]}
    ]}
TAG[0x0501]={block:"driverCardApplicationIdentification",properties:[
    {name:"equipmentType",size :size_card.TYPEOFTACHOGRAPHCARDID[0], type:"EquipmentType",properties:[]},
    {name:"CardStructureVersion",size: size_card.CARDSTRUCTUREVERSION[0], type:"OctetString",properties:[]},
    {name:"noOfEventsPerType",size :size_card.NOOFEVENTSPERTYPE[0], type:"Number",properties:[]},
    {name:"NoOfFaultsPerType",size :size_card.NOOFFAULTSPERTYPE[0], type:"Number",properties:[]},
    {name:"CardActivityLengthRange",size :size_card.ACTIVITYSTRUCTURELENGTH[0], type:"Number",properties:[]},
    {name:"NoOfCardVehicleRecords",size :size_card.NOOFCARDVEHICLERECORDS[0], type:"Number",properties:[]},
    {name:"NoOfCardPlaceRecords",size :size_card.NOOFPLACERECORDS[0], type:"Number",properties:[]},
]}
TAG[0x0502]={block:"cardEventData",properties:[
    {name:"cardEventRecords",size :size_card.CARDEVENTDATA[0], type:"Array",properties:[
        {name:"eventType",size :size_card.EVENTTYPE[0], type:"EventFaultType",properties:[]},
        {name:"eventBeginTime",size :size_card.EVENTBEGINTIME[0], type:"Date",properties:[]},
        {name:"eventEndTime",size :size_card.EVENTENDTIME[0], type:"Date",properties:[]},
        {name:"eventVehicleRegistration",size :size_card.EVENTVEHICLEREGISTRATION[0], type:"Object",properties:[
            {name:"vehicleRegistrationNation",size :size_card.VEHICLEREGISTRATIONNATION[0], type:"NationNumeric",properties:[]},
            {name:"vehicleRegistrationNumber",size :size_card.VEHICLEREGISTRATIONNUMBER[0], type:"String",properties:[]}
        ]},
    ]},

]}
TAG[0x0503]={block:"cardFaultData",properties:[
    {name:"cardFaultRecords",size: size_card.CARDFAULTRECORD[0], type:"Array",properties:[
        {name:"faultType",size :size_card.FAULTTYPE[0], type:"EventFaultType",properties:[]},
        {name:"faultBeginTime",size :size_card.FAULTBEGINTIME[0], type:"Date",properties:[]},
        {name:"faultEndTime",size :size_card.FAULTENDTIME[0], type:"Date",properties:[]},
        {name:"faultVehicleRegistration",size :size_card.FAULTVEHICLEREGISTRATION[0], type:"Object",properties:[
            {name:"vehicleRegistrationNation",size :size_card.VEHICLEREGISTRATIONNATION[0], type:"NationNumeric",properties:[]},
            {name:"vehicleRegistrationNumber",size :size_card.VEHICLEREGISTRATIONNUMBER[0], type:"String",properties:[]}
        ]},
    ]},

]}
TAG[0xffff]={block:"cardEventData",properties:[
    {name:"cardEventRecords",size :size_card.CARDEVENTRECORDS[0], type:"Array",properties:[
        {name:"eventType",size :size_card.EVENT, type:"EventFaultType",properties:[]},
        {name:"eventBeginTime",size :4, type:"Date",properties:[]},
        {name:"eventEndTime",size :4, type:"Date",properties:[]},
        {name:"eventVehicleRegistration",size :15, type:"Object",properties:[
            {name:"vehicleRegistrationNation",size :1, type:"NationNumeric",properties:[]},
            {name:"vehicleRegistrationNumber",size :14, type:"String",properties:[]}
        ]},
    ]},

]}
TAG[0x0505]={block:"cardVehiclesUsed",properties:[
    {name:"vehiclePointerNewestRecord",size :size_card.VEHICLEPOINTERNEWESTRECORD[0], type:"bytestoNumber",properties:[]},
    {name:"cardVehicleRecords",size :size_card.CARDVEHICLERECORDS[0], type:"Array",properties:[
        {name:"vehiclePointerNewestRecord",size :size_card.VEHICLEPOINTERNEWESTRECORD[0], type:"bytestoNumber",properties:[]},
        {name:"cardVehicleRecords",size :size_card.CARDVEHICLERECORDS[0], type:"Array",properties:[
            {name:"vehicleOdometerBegin",size :size_card.VEHICLEODOMETERBEGIN[0], type:"bytestoNumber",properties:[]},
            {name:"vehicleOdometerEnd",size :size_card.VEHICLEODOMETEREND[0], type:"bytestoNumber",properties:[]},
            {name:"vehicleFirstUse",size :size_card.VEHICLEFIRSTUSE[0], type:"bytestoDate",properties:[]},
            {name:"vehicleLastUse",size :size_card.VEHICLELASTUSE[0], type:"bytestoDate",properties:[]},
            {name:"vehicleRegistration",size :size_card.VEHICLEREGISTRATION[0], type:"Object",properties:[
                {name:"vehicleRegistrationNation",size :size_card.VEHICLEREGISTRATIONNATION[0], type:"NationNumeric",properties:[]},
                {name:"vehicleRegistrationNumber;",size :size_card.VEHICLEREGISTRATIONNUMBER[0], type:"bytestoString",properties:[]},
            ]},
            {name:"vuDataBlockCounter",size :size_card.VUDATABLOCKCOUNTER[0], type:"bytestoNumber",properties:[]},
        ]},
    ]},

]}
TAG[0x0506]={block:"cardPlaceDailyWorkPeriod",properties:[
    {name:"placePointerNewestRecord",size :size_card.PLACEPOINTERNEWESTRECORD[0], type:"bytetoNumber",properties:[
        {name:"placeRecords",size :size_card.PLACERECORDS[0], type:"Array",properties:[
            {name:"entryTime",size :size_card.ENTRYTIME[0], type:"bytestoDate",properties:[]},
            {name:"entryTypeDailyWorkPeriod",size :size_card.ENTRYTYPEDAILYWORKPERIOD[0], type:"bytestoString",properties:[]},
            {name:"dailyWorkPeriodCountry",size :size_card.DAILYWORKPERIODCOUNTRY[0], type:"bytestoString",properties:[]},
            {name:"dailyWorkPeriodRegion",size :size_card.DAILYWORKPERIODREGION[0], type:"bytestoString",properties:[]},
            {name:"vehicleOdometerValue",size :size_card.VEHICLEODOMETERVALUE[0], type:"bytestoNumber",properties:[]},
        ]},
    ]},

]}
TAG[0x0507]={block:"CardCurrentUse",properties:[
    {name:"sessionOpenTime",size :size_card.SESSIONOPENTIME[0], type:"bytestoDate",properties:[]},
    {name:"sessionOpenVehicle",size :size_card.SESSIONOPENVEHICLE[0], type:"Object",properties:[
        {name:"vehicleRegistrationNation",size :size_card.VEHICLEREGISTRATIONNATION[0], type:"NationNumeric",properties:[]},
        {name:"vehicleRegistrationNumber;",size :size_card.VEHICLEREGISTRATIONNUMBER[0], type:"bytestoString",properties:[]},
    ]},

]}
TAG[0x0508]={block:"CardControlActivityDataRecord",properties:[
    {name:"controlType",size :size_card.CONTROLTYPE[0], type:"ControlType",properties:[]},
    {name:"controlTime",size :size_card.CONTROLTIME[0], type:"bytestoDate",properties:[]},
    {name:"controlCardNumber",size :size_card.CONTROLCARDNUMBER[0], type:"Objet",properties:[
        {name:"cardType",size :size_card.CARDTYPE[0], type:"bytestoString",properties:[]},
        {name:"cardIssuingMemberState",size :size_card.CARDISSUINGMEMBERSTATE[0], type:"bytestoString",properties:[]},
        {name:"cardNumber",size :size_card.CARDNUMBER[0], type:"Object",properties:[
            {name:"driverIdentification",size :size_card.DRIVERIDENTIFICATION[0], type:"bytestoString",properties:[]},
            {name:"drivercardReplacementIndex",size :size_card.DRIVERCARDREPLACEMENTINDEX[0], type:"bytestoString",properties:[]},
            {name:"drivercardRenewalIndex",size :size_card.DRIVERCARDRENEWALINDEX[0], type:"bytestoString",properties:[]},
        ]},
    ]},
    {name:"controlVehicleRegistration",size :size_card.VEHICLEREGISTRATION[0], type:"Object",properties:[
            {name:"vehicleRegistrationNation",size :size_card.VEHICLEREGISTRATIONNATION[0], type:"NationNumeric",properties:[]},
            {name:"vehicleRegistrationNumber;",size :size_card.VEHICLEREGISTRATIONNUMBER[0], type:"bytestoString",properties:[]},
    ]},
    {name:"controlDownloadPeriodBegin",size :size_card.CONTROLDOWNLOADPERIODBEGIN[0], type:"bytestoDate",properties:[]},
    {name:"controlDownloadPeriodEnd",size :size_card.CONTROLDOWNLOADPERIODEND[0], type:"bytestoDate",properties:[]},

]}
TAG[0x050e]={block:"NoOfCalibrationsSinceDownload",properties:[
    {name:"lastCardDownload",size :size_card.LASTCARDDOWNLOAD[0], type:"bytestoDate",properties:[]},
]}
TAG[0x0520]={block:"CardIdentification",properties:[
    {name:"cardIssuingMemberState",size :size_card.CARDISSUINGMEMBERSTATE[0], type:"bytestoString",properties:[]},
    {name:"cardNumber",size :size_card.CARDNUMBER[0], type:"Object",properties:[
        {name:"driverIdentification",size :size_card.DRIVERIDENTIFICATION[0], type:"bytestoString",properties:[]},
        {name:"drivercardReplacementIndex",size :size_card.DRIVERCARDREPLACEMENTINDEX[0], type:"bytestoString",properties:[]},
        {name:"drivercardRenewalIndex",size :size_card.DRIVERCARDRENEWALINDEX[0], type:"bytestoString",properties:[]},
    ]},
    {name:"cardIssuingAuthorityName",size :size_card.CARDISSUINGAUTORITYNAME[0], type:"bytestoString",properties:[]},
    {name:"cardIssueDate",size :size_card.CARDISSUEDATE[0], type:"bytestoDate",properties:[]},
    {name:"cardValidityBegin",size :size_card.CARDVALIDITYBEGIN[0], type:"bytestoDate",properties:[]},
    {name:"cardExpiryDate",size :size_card.CARDEXPIRYDATE[0], type:"bytestoDate",properties:[]},
    {name:"driverCardHolderIdentification",size :size_card.DRIVERCARDHOLDERIDENTIFICATION[0], type:"Object",properties:[
        {name:"cardHolderName",size :size_card.CARDHOLDERNAME[0], type:"Object",properties:[
            {name:"holderSurname",size :size_card.HOLDERSURNAME[0], type:"bytestoString",properties:[]},
            {name:"holderFirstName",size :size_card.HOLDERFIRTSNAMES[0], type:"bytestoString",properties:[]},
        ]},
        {name:"cardHolderBirthDate",size :size_card.CARDHOLDERBIRTHDATE[0], type:"bytestoString",properties:[]},
        {name:"cardHolderPreferredLanguage",size :size_card.CARDHOLDERPREFERREDLANGUAGE[0], type:"bytestoString",properties:[]},
    ]},
]}
TAG[0x0521]={block:"cardDrivingLicenceInformation",properties:[
    {name:"drivingLicenceIssuingAuthority",size :size_card.DRIVINGLICENCEISSUINGAUTHORITY[0], type:"bytestoString",properties:[]},
    {name:"drivingLicenceIssuingNation",size :size_card.DRIVINGLICENCEISSUINGNATION[0], type:"bytestoString",properties:[]},
    {name:"drivingLicenceNumber",size :size_card.DRIVINGLICENCENUMBER[0], type:"bytestoDate",properties:[]},
]}
TAG[0x0522]={block:"specificConditionRecord",properties:[
    {name:"entryTime",size :size_card.ENTRYTIME[0], type:"bytestoDate",properties:[]},
    {name:"specificConditionType",size :size_card.SPECIFICCIONDITIONTYPE[0], type:"bytestoString",properties:[]},

]}

function propertiesArray(buffer,start,i,end,properties,array,sizeBlock){
    var obj=blockProperties(properties,0,buffer,start,{})
    if(obj.eventType)
        if(obj.eventType!="No hay más información" && i<end)
            array.push(obj)
    if(obj.faultType)
        if(obj.faultType!="No hay más información" && i<end )
            array.push(obj)

    return i>end?
        array:
        propertiesArray(buffer,start+sizeBlock,i+1,end,properties,array,sizeBlock)

}
function bytestoDate(buffer,start,size){
    var n
    n=bytestoNumber(buffer,start,size)*1000
    return new Date(n)
}
function bytestoString(buffer,start,size){
    String.fromCharCode.apply(null, buffer.slice(start, start+size)).trim()
}
function bytestoNumber (array, i, size) {
    var end=i+size
    switch (size){
        case 1:
            var result = (array[end - 1])
            break
        case 2:
            var result = ((array[end - 1]) |
            (array[end - 2] << 8) )
            break
        case 3:
            var result = ((array[end - 1]) |
            (array[end - 2] << 8) |
            (array[end - 3] << 16))
            break
        case 4:
            var result = ((array[end - 1]) |
            (array[end - 2] << 8) |
            (array[end - 3] << 16) |
            (array[end - 4] << 24));
            break
    }

    return result;
}
function BCDtoString(buffer,start,size){
    var str =""
    for (var i=start;i<start+size;i++){
        // elimino 4 ultimos bits
        var high = (buffer[i] & 0xf0);
        // desplazo los 4 bits hacia la derecha
        high >>>=  4;
        // pongo a cero los cuatro primeros bits
        high =  (high & 0x0f);
        // elimino los 4 primeros bits
        var low =  (buffer[i] & 0x0f);
        str+=high.toString()+low.toString()
    }

    return str;
}
function OctetString(buffer,start,size){
    var str =""
    for (var i=start;i<start+size;i++){
        str+=("0"+buffer[i].toString(16)).slice(-2)+" "
    }

    return str.trim();
}
function ManufactureCode(buffer,start,size){
    var str
    switch (buffer[start]) {
        case 0x00:
            str="No information available";
            break;
        case 0x01:
             str="Reserved value";
            break;
        case 0x10:
            str= "Actia S.A.";
            break;
        case 0x12:
            str= "Austria Card Plastikkarten und Ausweissysteme GmbH";
            break;
        case 0x13:
            str= "Agencija za komercijalnu djelatnost d.o.o (AKD)";
            break;
        case 0x20:
            str= "CETIS d.d.";
            break;
        case 0x21:
            str= "certSIGN";
            break;
        case 0x22:
            str= "RUE Cryptotech";
            break;
        case 0x30:
            str= "Sdu Identification B.V. (formerly Ensched�/Sdu B.V.)"
            break;
        case 0x32:
            str= "EFKON AG.";
            break;
        case 0x38:
            str= "Fabrica Nacional de Moneda y Timbre";
            break;
        case 0x40:
            str= "Giesecke & Devrient GmbH";
            break;
        case 0x43:
            str= "Giesecke & Devrient GB Ltd.";
            break;
        case 0x44:
            str= "Giesecke & Devrient sa/nv";
            break;
        case 0x48:
            str= "Hungarian Banknote Printing Co. Ltd.";
            break;
        case 0x50:
            str= "Imprimerie Nationale";
            break;
        case 0x51:
            str= "Imprensa Nacional-Casa da Moeda, SA";
            break;
        case 0x52:
            str= "InfoCamere S.C.p.A";
            break;
        case 0x81:
            str= "Morpho e-documents  (formerly Sagem Orga and before that ORGA Kartensysteme GmbH)"
            break;
        case 0x82:
            str= "ORGA Zelenograd ZAO";
            break;
        case 0x88:
            str= "Asseco Czech Republic a.s. (formerly PVT a.s.)"
            break;
        case 0x89:
            str= "Polska Wytw�rnia Papier�w Wartosciowych S.A. - PWPW S.A.";
            break;
        case 0xA1:
            str= "Continental Automotive GmbH (formerly Siemens AG - Siemens VDO Automotive)"
            break;
        case 0xA2:
            str= "Stoneridge Electronics AB";
            break;
        case 0xA3:
            str= "Gemalto  (formerly Schlumberger SEMA, Axalto and before that)"
            break;
        case 0xA4:
            str= "3M Security Printing and Systems Ltd.";
            break;
        case 0xD8:
            str= "Union of Chambers and Commodity Exchanges of Turkey - TOBB";
            break;
        case 0xAB:
            str= "T-Systems International GmbH";
            break;
        case 0xAC:
            str= "Tr�b AG";
            break;
        case 0xAD:
            str= "Tr�b Baltic AS";
            break;
        case 0xAE:
            str= "TEMPEST a.s.";
            break;
        case 0xAF:
            str= "Trueb - DEMAX PLC";
            break;
        default:
            str="Unknown Manufacturer %s or equipment not type approved "+buffer[start];
            break
    }

    return str

}
function EquipmentType(buffer,start,size){
    var str
    switch(buffer[start]){
        case 0 :
            str = "Reserved(0)"
            break
        case 1:
            str = "Driver Card (1)";
            break
        case 2:
            str = "Workshop Card(2)";
            break
        case 3:
            str = "Control Card(3)";
            break
        case 4:
            str = "Company Card(4)";
            break
        case 5:
            str = "Manufacturing Card(5)";
            break
        case 6:
            str = "Vehicle Unit(6)";
            break
        case 7:
            str = "Motion Sensor(7)";
            break
        default:
            str = "RFU(8....255)";
            break

    }
    return str
}
function NationNumeric(buffer,start,size){
    var cadena="";
    switch(buffer[start]){
        case 0x00:cadena="No hay informacion disponible (00)H";break;
        case 0x01:cadena="Austria (01)H";break;
        case 0x02:cadena="Albania (02)H";break;
        case 0x03:cadena="Andorra (03)H";break;
        case 0x04:cadena="Armenia (04)H";break;
        case 0x05:cadena="Azerbaiy�n (05)H";break;
        case 0x06:cadena="Belgica (06)H";break;
        case 0x07:cadena="Bulgaria (07)H";break;
        case 0x08:cadena="Bosnia y Hercegovina (08)H";break;
        case 0x09:cadena="Bielorrusia (09)H";break;
        case 0x0a:cadena="Suiza (0A)H";break;
        case 0x0b:cadena="Chipre (0B)H";break;
        case 0x0c:cadena="Republica Checa (0C)H";break;
        case 0x0d:cadena="Alemania (0D)H";break;
        case 0x0e:cadena="Dinamarca (0E)H";break;
        case 0x0f:cadena="España (0F)H";break;
        case 0x10:cadena="Estonia (10)H";break;
        case 0x11:cadena="Francia (11)H";break;
        case 0x12:cadena="Finlandia (12)H";break;
        case 0x13:cadena="Liechtenstein (13)H";break;
        case 0x14:cadena="Islas Feroe (14)H";break;
        case 0x15:cadena="Reino Unido (15)H";break;
        case 0x16:cadena="Georgia (16)H";break;
        case 0x17:cadena="Grecia (17)H";break;
        case 0x18:cadena="Hungria (18)H,";break;
        case 0x19:cadena="Croacia (19)H";break;
        case 0x1a:cadena="Italia (1A)H";break;
        case 0x1b:cadena="poikl Irlanda (1B)H";break;
        case 0x1c:cadena="Islandia (1C)H";
        case 0x1d:cadena=" Kazajistan (1D)H";break;
        case 0x1e:cadena="Luxemburgo (1E)H";break;
        case 0x1f:cadena="Lituania (1F)H";break;
        case 0x20:cadena="Letonia (20)H";break;
        case 0x21:cadena="Malta (21)H";break;
        case 0x22:cadena="Monaco (22)H";break;
        case 0x23:cadena="Republica de Moldavia (23)H";break;
        case 0x24:cadena="Macedonia (24)H";break;
        case 0x25:cadena="Noruega (25)H";break;
        case 0x26:cadena="Paises Bajos (26)H";break;
        case 0x27:cadena="Portugal (27)H";break;
        case 0x28:cadena="Polonia (28)H";break;
        case 0x29:cadena="Rumania (29)H";break;
        case 0x2a:cadena="San Marino (2A)H";break;
        case 0x2b:cadena="Federacion Rusa (2B)H";break;
        case 0x2c:cadena="Suecia (2C)H";break;
        case 0x2d:cadena="Eslovaquia (2D)H";break;
        case 0x2e:cadena="Eslovenia (2E)H";break;
        case 0x2f:cadena="Turkmenistan (2F)H";break;
        case 0x30:cadena="Turquia (30)H";break;
        case 0x31:cadena="Ucrania (31)H";break;
        case 0x32:cadena="Vaticano (32)H";break;
        case 0x33:cadena="Yugoslavia (33)H";break;
        case 0xFC:cadena="RFU (34..FC)H";break;
        case 0xfd:cadena="Comunidad Europea (FD)H";break;
        case 0xfe:cadena="Resto de Europa (FE)H";break;
        case 0xff:cadena="Resto del mundo (FF)H";break;
    }

    return cadena;
}
function EventFaultType(buffer,start,size){
    var str="";
    switch (buffer[start]) {
        //0xIncidentes de carácter general,
        case 0x00:str="No hay más información";break;
        case 0x01:str="Inserción de una tarjeta no válida";break;
        case 0x02:str="Conflicto de tarjetas";break;
        case 0x03:str="Solapamiento temporal";break;
        case 0x04:str="Conducción sin tarjeta adecuada";break;
        case 0x05:str="Inserción de tarjeta durante la conducción";break;
        case 0x06:str="Error al cerrar la última sesión de la tarjeta";break;
        case 0x07:str="Exceso de velocidad";break;
        case 0x08:str="Interrupción del suministro eléctrico";break;
        case 0x09:str="Error en datos de movimiento";break;
        case 0x0a:str="Conflicto de movimiento del vehículo";break;
        //′0B′H .. ′0F′H RFU,
        //′1x′H Intentos de violación de la seguridad relacionados con la unidad intravehicular,
        case 0x10:str="No hay más información";break;
        case 0x11:str="Fallo de autentificación del sensor de movimiento";break;
        case 0x12:str="Fallo de autentificación de la tarjeta de tacógrafo";break;
        case 0x13:str="Cambio no autorizado del sensor de movimiento";break;
        case 0x14:str="Error de integridad en la entrada de los datos de la tarjeta";break;
        case 0x15:str="Error de integridad en los datos de usuario almacenados";break;
        case 0x16:str="Error en una transferencia interna de datos";break;
        case 0x17:str="Apertura no autorizada de la carcasa";break;
        case 0x18:str="Sabotaje del hardware";break;
        //′19′H .. ′1F′H RFU
        //′2x′H Intentos de violación de la seguridad relacionados con el sensor,
        case 0x20:str="No hay más información";break;
        case 0x21:str="Fallo de autentificación";break;
        case 0x22:str="Error de integridad en los datos almacenados";break;
        case 0x23:str="Error en una transferencia interna de datos";break;
        case 0x24:str="Apertura no autorizada de la carcasa";break;
        case 0x25:str="Sabotaje del hardware";break;
        // ′26′H .. ′2F′H RFU,
        // ′3x′H Fallos del aparato de control
        case 0x30:str="No hay más información";break;
        case 0x31:str="Fallo interno de la VU";break;
        case 0x32:str="Fallo de la impresora";break;
        case 0x33:str="Fallo de la pantalla";break;
        case 0x34:str="Fallo de transferencia";break;
        case 0x35:str="Fallo del sensor";break;
        //′36′H .. ′3F′H RFU
        //′4x′H	Fallos de las tarjetas
        case 0x40:str="No hay más información";break;
        //′41′H .. ′4F′H RFU
        //′50′H .. ′7F′H RFU
        //′80′H .. ′FF′H Específicos del fabricante
        default:
            if (buffer[start]>0x80){
                str="Específicos del fabricante";
            }else{
                str="RFU";
            }
            break;
    }
    return str;


}
function ControlType(buffer,start,size){
    var bits = [];
    for (var i = 7; i >= 0; i--) {
        var bit = buffer[start] & (1 << i) ? 1 : 0;
        bits.push(bit);
    }

    var c,v,p,d;
    c=bits[0]
    v=bits[1]
    p=bits[2]
    d=bits[3]

    //'c'B transferencia de los datos de la tarjeta:
    c=(c==0)?"datos de la tarjeta no transferidos durante esta actividad de control":
        "datos de la tarjeta transferidos durante esta actividad de control";
    //'v'B transferencia de los datos de la VU:
    v=(v==0)?"datos de la VU no transferidos durante esta actividad de control":
        "datos de la VU transferidos durante esta actividad de control";
    // 'p'B impresi�n:
    p=(p==0)?"no se imprimen datos durante esta actividad de control":
        "se imprimen datos durante esta actividad de control";
    // 'd'B visualizaci�n:
    d=(v==0)?"no se visualizan datos durante esta actividad de control":
        "se visualizan datos durante esta actividad de control";

    return {c:c,v:v,p:p,d:d}
}