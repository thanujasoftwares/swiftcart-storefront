
const nodemailer = require('nodemailer');
const confirmOrderNotifier = require("redis").createClient();
const {ProductController, MenuController, InventoryController, OrderController, CustomerController, SiteattributeController} = require('./controllers');

var siteattributes = [];
SiteattributeController.getAll().then((sa)=>{
    siteattributes = sa;
}).catch((err)=>{
    console.log(err);
    console.log("Unable to get site attributes");
})

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'noreply@hsshoppie.com', // generated ethereal user
        pass: 'f=dP5QnW'  // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
});

confirmOrderNotifier.on("message", function(channel, message) {

    var msgparts = message.split("-");

    OrderController.getOrder(msgparts[1],msgparts[0]).then((order)=>{
        let msgHtmlBody=`
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="format-detection" content="telephone=no">
        <style type="text/css">@import url('https://fonts.googleapis.com/css?family=Audiowide'); body {width: 100% !important;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;mso-line-height-rule: exactly;}table td { border-collapse: collapse;}table td {border-collapse: collapse;}img {    outline: none;    text-decoration: none;    -ms-interpolation-mode: bicubic;}a img {    border: none;}@media only screen and (max-device-width: 480px) {    table[id="outercontainer_div"] {        max-width: 480px !important;    }    table[id="nzInnerTable"],    table[class="nzpImageHolder"],    table[class="imageGroupHolder"] {        width: 100% !important;        min-width: 320px !important;    }    table[class="nzpImageHolder"] td, td[class="table_seperator"], td[class="table_column"]    {        display: block !important;        width: 100% !important;    }    table[class="nzpImageHolder"] img	{        width: 100% !important;    }    table[class="nzpButt"] {        display: block !important;        width: auto !important;     }	   #nzInnerTable td, #outercontainer_div td {padding: 0px !important; margin: 0px !important;}}</style>
        </head>
        <body style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; background: #EEEEEE; background-image: url('http://www.mpzmail.com/cp3/images/newslettertextures/grayWallpaper.jpg'); background-repeat: repeat;" background="'http://www.mpzmail.com/cp3/images/newslettertextures/grayWallpaper.jpg">
        <table width="100%"  cellpadding="30" id="outercontainer_div"><tr><td align="center">
        <table width="600" bgColor="#FFFFFF" cellpadding="15" cellspacing="0" id="nzInnerTable" border="0" style="border: 1px solid #FFFFFF;"><tr><td><div id="innerContent"><table width="100%" cellspacing="0" cellpadding="0" style="padding: 0px; padding-top: 0px; padding-bottom: 15px;">
        <tr><td><table width="100%" cellpadding="0" cellspacing="0" style=""><tr><td bgColor="">
        <div id="txtHolder-2" class="txtEditorClass" style="color: #000000; font-size: 26px; font-family: 'Audiowide', cursive; text-align: Left">${siteattributes.title.value0}</div>
        </td></tr></table></td></tr></table><table width="100%" cellspacing="0" cellpadding="0" style="padding: 0px; padding-top: 0px; padding-bottom: 15px;"><tr><td><table width="100%" cellpadding="0" cellspacing="0" style=""><tr><td bgColor=""><div id="txtHolder-3" class="txtEditorClass" style="color: #666666; font-size: 14px; font-family: 'Arial'; text-align: Left">
        <b>Thanks for your order: <a href="http://www.hsshoppie.com/guest/orders/${order.id}-${order.CustomerId}-${order.TrackingNumber}.html" >${order.id}-${order.CustomerId}-${order.TrackingNumber}</a></b><br><br>Please pay below amount using paytm to proceed further<div><br></div>
        <div>Mobile Number: ${siteattributes.ccpno.value0}</div><div><br></div>
        <div>Payment Amount: INR ${order.totalprice.toFixed(2)}</div><div><br></div>
    
        <div>Note: this automated mail, please do not reply to this, for any comments/suggestions or enquires please contact ${siteattributes.cceaddr.value0}</div><div><br></div>
        <div>Thanks,</div><div>HS Shoppie Sales Team</div><div><br></div></div></td></tr></table></td></tr></table><table width="100%" cellspacing="0" cellpadding="10" ><tr><td align="Center" bgColor="#f1f1f1"><div><div id="txtHolder-4" class="txtEditorClass" style="color: #5d5d5d; font-size: 11px; font-family: 'Arial';">HS Shoppie.com</div></div></td></tr></table></div></td></tr></table></td></tr></table></body></html>    
        `
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"HSShoppie" <noreply@hsshoppie.com>', // sender address
            to: `support@hsshoppie.com,${msgparts[3]}`, // list of receivers
            subject: `Order Confimation - ${order.id}-${order.CustomerId}-${order.TrackingNumber}`, // Subject line
            text: `Order Confirmation - ${order.id}-${order.CustomerId}-${order.TrackingNumber}, please pay us order amount of INR ${order.totalprice.toFixed(2)} using paytm mobile number:  ${siteattributes.ccpno.value0}. Thanks, Sales Team`, // plain text body
            html: msgHtmlBody // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    })
    console.log("Order: " + message + " is confirmed");
});
  
confirmOrderNotifier.subscribe("send:orderconfirm");