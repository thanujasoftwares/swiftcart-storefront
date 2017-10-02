// Function to check element is exist ========================================================
$.fn.exist = function(){ return $(this).length > 0; }

// Wrap IIFE around the code
jQuery(document).ready(function($){
    $(function(){
        $("[data-option]").each(function(index,element){
            $(this).hide();
        });
    
        localStorage.setItem('pfsize','default');

        $("[data-formpicker]").each(function(index,element){
            $(element).on("changed.bs.select",function(event){
                var sps=($(this).val()).split("-");
                var val = "#"+$(this).val();
                var cfrom = "#"+sps[0]+"-"+localStorage.getItem('pfsize');
                $(cfrom).hide();
                localStorage.setItem('pfsize',sps[1]);
                if($(val).hasClass('hide')){
                    $(val).removeClass("hide");
                }else{
                    $(val).show();
                }
                
            });
        });
    });

    $('.add-to-cart').each((index,element)=>{
        $(element).on("click",function(element){
                // Create Base64 Object
                var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
            
                var qty=1;
                var img="";
                var url="";
                var name="";
                var price=0;
                var sku="";
                var size="0-0";
                var disc=0;
                var uprice=0;
                var pid=0;
                var invid=0;
                
                var sel = "#"+$(this).attr("data-form");
                $(sel).find("[data-cart-attribute]").each((index,element)=>{
                    var attrvalue=$(element).attr("data-cart-attribute");
                    attrvalue=attrvalue.trim();
                    switch(attrvalue){
                        case 'qty': qty = parseFloat($(element).val()) || 1; break;
                        case 'img': img = $(element).val() || '/images/demo/polo1.jpg'; break;
                        case 'url': url = window.location.href; break;
                        case 'name': name = $(element).val() || 'unknown'; break;
                        case 'price': price = parseFloat($(element).val()) || 0; break;
                        case 'sku': sku = $(element).val() || 'unknown'; break;
                        case 'size': size = $(element).val() || '0-0'; break;
                        case 'disc': disc = $(element).val() || 0; break;
                        case 'uprice': uprice = $(element).val() || 0; break;
                        case 'pid': pid = $(element).val() || 0; break;
                        case 'invid': invid = $(element).val() || 0; break;
                    }
                });

                var innerCartHTML='<div class="media" id="c-chk-'+sku+'-'+size+'"><div class="media-left"><a href="'+url+'"><img class="media-object img-thumbnail" src="'+img+'" width="50" alt="product"></a></div>';
                innerCartHTML +='<div class="media-body"><a href="'+url+'" class="media-heading">'+name+'</a><div>Size: <span cart-checkout-attribute="size">'+size+'</span> Qty: <span cart-checkout-attribute="qty">'+qty+'</span> Price: <span cart-checkout-attribute="price">'+(price*qty).toFixed(2)+'</span></div></div>';
                innerCartHTML +='<div class="media-right"><a href="javascript:removeItemFromCart(\'#c-chk-'+sku+'-'+size+'\');" data-toggle="tooltip" title="Remove"><i class="fa fa-remove"></i></a></div></div>';

                chkEle=$('#c-chk-'+sku+'-'+size);
                if(chkEle){
                    $(chkEle).remove();
                }

                $(innerCartHTML).appendTo('#cart-checkout-items-placeholder');

                $('[cart-checkout-attributes="cnt"]').text($("#cart-checkout-items-placeholder .media").length);

                // $("#cart-checkout-items-placeholder .media").each((element,index)=>{
                //     $('[cart-checkout-attributes="subtotal"]').text(subtotal);
                // });

                
                localStorage.removeItem('#c-chk-'+sku+'-'+size);

                localStorage.setItem('#c-chk-'+sku+'-'+size, JSON.stringify({
                    pid:pid,
                    qty:qty,
                    img:img,
                    url:url,
                    name:name,
                    price:price,
                    sku:sku,
                    size:size,
                    invid:invid
                }));
        });
    });
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        key=localStorage.key( i );
        if(key.indexOf('#c-chk-') == 0){
             var {qty,img,url,name,price,sku,size} = JSON.parse(localStorage.getItem(key));
             var innerCartHTML='<div class="media" id="c-chk-'+sku+'-'+size+'"><div class="media-left"><a href="'+url+'"><img class="media-object img-thumbnail" src="'+img+'" width="50" alt="product"></a></div>';
             innerCartHTML +='<div class="media-body"><a href="'+url+'" class="media-heading">'+name+'</a><div>Size: <span>'+size+'</span> Qty: <span>'+qty+'</span> Price: <span>'+(price*qty).toFixed(2)+'</span></div></div>';
             innerCartHTML +='<div class="media-right"><a href="javascript:removeItemFromCart(\'#c-chk-'+sku+'-'+size+'\');" data-toggle="tooltip" title="Remove"><i class="fa fa-remove"></i></a></div></div>';
             $(innerCartHTML).appendTo('#cart-checkout-items-placeholder');
         }
     }
     $('[cart-checkout-attributes="cnt"]').text($("#cart-checkout-items-placeholder .media").length);  
     
     $("form[data-form='login']").on("submit",function(event){
         event.preventDefault();
         var data = $(this ).serialize();
         var action = $(this).attr("action");
         var method = $(this).attr("method");
         data += '&redirect='+window.location.href;
         $.ajax({
            url: action,
            type: method,
            dataType:'json',
            data:data,
            success:function(result){
                if(result.status==302){
                    localStorage.removeItem('customer');
                    localStorage.setItem('customer', JSON.stringify({'id':result.cid,'url':result.redirect, 'type':result.type})); 
                    window.location = result.redirect;
                }
            },
            error:function(xhr,resp,text){
                console.log(resp);
            }
         });
     });

     $('a.nav-my-account').each(function(index,element){
        customer=localStorage.getItem('customer');  
         if(customer){
            customer=JSON.parse(customer);
            if(customer.type=='a'){
                $(this).attr("href","/admin/settings.html");
            }else{
                $(this).attr("href","/account/"+customer.id+'/profile.html');
            }
            $('[data-menu="'+customer.type+'"]').each(function(element){
                $(this).removeClass("hide");
            });
        }else{
            $('[data-menu="c"]').each(function(element){
                $(this).removeClass("hide");
            });
        }
     });

     var nowTemp = new Date();
     var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

     $('.input-group.date').each(function(index,element){
        $(this).children('input').each(function(index,element){
            $(this).val(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+(now.getDate()));
        }) 
        $(this).datepicker({
            autoclose:true,
            startDate:now,
            format:"yyyy-mm-dd"
        });
        // $(this).on('changeDate', function() {
        //     $('#my_hidden_input').val(
        //         $('#datepicker').datepicker('getFormattedDate')
        //     );
        // });         
    })

    $('.selectpicker').selectpicker();

 }); /* Jquery */

function removeItemFromCart(id){
    var element=$(id);
    if(element){
        $(element).remove();
        $(id+'-tr').remove();
        localStorage.removeItem(id);
        $('[cart-checkout-attributes="cnt"]').text($("#cart-checkout-items-placeholder .media").length); 
        var stotal=0;
        var gst=0.18;
        var ctotal=0.00;
        var dctotal = 0;
           
        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            key=localStorage.key( i );
            if(key.indexOf('#c-chk-') == 0){
                 var {qty,img,url,name,price,sku,size,invid} = JSON.parse(localStorage.getItem(key));
                 stotal += (price*qty);
             }
         }
    
         ctotal = stotal + (stotal * gst);
         $('#shop-cart-table-st').text(stotal.toFixed(2));
         $('#shop-cart-table-gst').text((stotal * gst).toFixed(2));
         $('#shop-cart-table-dc').text(dctotal.toFixed(2));
         $('#shop-cart-table-tt').text(ctotal.toFixed(2));
            
    }
}


function checkout(){
    var oitems={};
    $('[data-cart-attribute]').each((index,element)=>{
        var attrvalue=$(element).attr("data-cart-attribute");
        attrvalue=attrvalue.trim();
        switch(attrvalue){
            case 'fname': oitems['fname'] = $(element).val() || undefined; break;
            case 'lname': oitems['lname'] = $(element).val() || undefined; break;
            case 'eaddr': oitems['eaddr'] = $(element).val() || undefined; break;
            case 'pno': oitems['pno'] = $(element).val() ||undefined; break;
            case 'adrl1': oitems['adrl1'] = $(element).val() ||undefined; break;
            case 'adrl2': oitems['adrl2'] = $(element).val() || ''; break;
            case 'adrcty': oitems['adrcty'] = $(element).val() || undefined; break;
            case 'adrst': oitems['adrst'] = $(element).val() || undefined; break;
            case 'paytype': oitems['paytype'] = $(element).val() || undefined; break;
            case 'adrpst': oitems['adrpst'] = $(element).val() || undefined; break;
            case 'adbkid': oitems['adbkid'] = $(element).val() || undefined; break;
        }
    });
   
    oitems['items']=[]

    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        key=localStorage.key(i);
        if(key.indexOf('#c-chk-') == 0){
            var {qty,img,url,name,price,sku,size,pid,invid} = JSON.parse(localStorage.getItem(key));
            sizes=size.slice('-');
            oitems['items'].push({
                key:key,qty:qty,sku:sku,price:price,pid:pid,invid:invid
            })
        }            
     }


     var citems = JSON.parse(JSON.stringify(oitems));
     delete citems['items'];
     localStorage.removeItem('#cust-addr');
     localStorage.setItem('#cust-addr', JSON.stringify(citems));            


     var d = new Date();
     $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(oitems),
        dataType: 'json',
        success: function(data){
            if(data.status==200){
                clearShoppingCart();
                setTimeout(()=>{
                    window.location.href='/thankyou.html?trackingnumber='+data.trackingnumber+'&email='+data.email;
                },1000)
            }else{
                alert(data.message);
            }
        },
        error: function(){
            console.log("Checkout failed");
        },
        processData: false,
        type: 'POST',
        url: '/checkout.html?ts='+d.getTime()
    });

    
}

function clearShoppingCart(){
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        key=localStorage.key(i);
        console.log(key);
        if(key && key.indexOf('#c-chk-') == 0){
            localStorage.removeItem(key);
        }            
     }    
}

function logout(){
    localStorage.removeItem("customer");
    $.ajax({
        url: '/login.html',
        type: 'DELETE',
        dataType:'json',
        data:1,
        success:function(result){
            if(result.status==302){
                localStorage.removeItem('customer');
                window.location.href="/";
            }
        },
        error:function(xhr,resp,text){
            console.log(resp);
        }
    });
}

function fetchorder(){
    order = $("#nav-ord-track").val();
    patrn = /[0-9]{1,}[-]{1}[0-9]{1,}[-]{1}[a-z0-9]{12}/
    if(order.length>15 && patrn.test(order) ){
        window.location.href='/guest/orders/'+order+'.html';
    }else{
        alert("invalid order number");
    }
}
