// Function to check element is exist ========================================================
$.fn.exist = function(){ return $(this).length > 0; }

// Wrap IIFE around the code
jQuery(document).ready(function($){
    $(function(){
        $("[data-option]").each(function(index,element){
            $(this).hide();
        });
        $("[data-picker]").each(function(index,element){
            var element = $(this);
            var hasoption = $(this).attr('data-option');
            var pickvalue = $(this).attr('data-picker');
            var pickervalue = $(this).attr('data-picker-value');
            if (typeof hasoption !== typeof undefined && hasoption !== false) {
                $(this).hide();
            } 
            if (typeof pickvalue !== typeof undefined && pickvalue !== false) {
                $("[data-option='"+pickvalue+"'][data-option-value=default]").show();
            } 

            var eventCallback=function(index,element){
                var element=$(this);
                var pickvalue=$(this).attr("data-picker");
                var optionvalue=element.val();
                var defaultvalue = $(this).attr('data-picker-default');

                if (typeof optionvalue !== typeof undefined && optionvalue !== false) {
                    if(optionvalue==""){
                        optionvalue='default';
                    }
                }

                if (typeof optionvalue === typeof undefined || optionvalue === false || optionvalue=="default") {
                    optionvalue = $(this).attr('data-picker-value');
                    if (typeof optionvalue === typeof undefined || optionvalue === false || optionvalue=="default") {
                        optionvalue='default';
                    }
                } 
                
                if (typeof defaultvalue !== typeof undefined && defaultvalue !== false) {
                    $("[data-picker='"+defaultvalue+"']").hide();
                } 
                if (typeof pickvalue !== typeof undefined && pickvalue !== false) {
                    $("[data-option='"+pickvalue+"'][data-option-value=default]").hide();
                    $("[data-option='"+pickvalue+"'][data-option-value!="+optionvalue+"]").hide();
                    $("[data-option='"+pickvalue+"'][data-option-value="+optionvalue+"]").show();

                    if(optionvalue=='default'){
                        $("[data-picker][data-option='"+pickvalue+"'][data-option-value!=default]").each(function(index,element){
                            var pickvalue = $(this).attr('data-picker');
                            $("[data-option='"+pickvalue+"']").hide();
                            $("[data-option='"+pickvalue+"'][data-option-value=default]").show();
                            return;
                        });
                    }
                } 

                var inElement=$("#"+pickvalue).val(optionvalue);

            }

            $(element).on("change",eventCallback);
            $(element).on("click",eventCallback);

            // $(element).on("click",function(){
            //     var element=$(this);
            //     var pickvalue=$(this).attr("data-picker");
            //     var optionvalue=element.val();
            //     var defaultvalue = $(this).attr('data-picker-default');
            //     if (typeof defaultvalue !== typeof undefined && defaultvalue !== false) {
            //         $("[data-picker='"+defaultvalue+"']").hide();
            //     } 
            //     if (typeof pickvalue !== typeof undefined && pickvalue !== false) {
            //         $("[data-option='"+pickvalue+"'][data-option-value=default]").hide();
            //         $("[data-option='"+pickvalue+"'][data-option-value!="+optionvalue+"]").hide();
            //         $("[data-option='"+pickvalue+"'][data-option-value="+optionvalue+"]").show();
            //     } 
            // });
            // $(element).on("change",function(){
            //     var element=$(this);
            //     var pickvalue=$(this).attr("data-picker");
            //     var optionvalue=element.val();
            //     var defaultvalue = $(this).attr('data-picker-default');
            //     if (typeof defaultvalue !== typeof undefined && defaultvalue !== false) {
            //         $("[data-picker='"+defaultvalue+"']").hide();
            //     } 
            //     if (typeof pickvalue !== typeof undefined && pickvalue !== false) {
            //         $("[data-option='"+pickvalue+"'][data-option-value=default]").hide();
            //         $("[data-option='"+pickvalue+"'][data-option-value!="+optionvalue+"]").hide();
            //         $("[data-option='"+pickvalue+"'][data-option-value="+optionvalue+"]").show();
            //     } 
            // });
        });
    });
});