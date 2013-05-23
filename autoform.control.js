/** 
 * 參考 
 * http://ajpiano.com/widgetfactory/#slide10
 * http://api.jqueryui.com/jQuery.widget/#method-widget
 * http://stackoverflow.com/questions/5007279/extending-an-existing-jquery-function
 * http://www.jquerysdk.com/api/jQuery.widget
 * http://api.jquery.com/jQuery.proxy/
 */

/**
 * @author yjtsai
 * @require jQuery > 1.4
 * @param  widgetPrefix		(string)
 * @param	widgetContainer		(string can be null)
 * @param	widgetName 			(string)
 * @param	widgetEvent			(string [ before | after | override ])
 * @param	widgetFunctionName	(string)
 * @param	widgetSwitch		(string [ on | off | offall])
 * @param	widgetHandler		(function)
 * @example $.control( widgetPrefix, widgetContainer, widgetName, widgetEvent, widgetFunctionName, widgetSwitch, widgetHandler );
 * 
 * 
 * widgetPrefix				: Prefix 使用方式為找出 widget 的前置名稱：此部分為 autoform，更多訊息請參考：http://ajpiano.com/widgetfactory/#slide10 (內含 widget 內部函數的使用方法與呼叫方法)
 * widgetContainer			: 可以提供一個或者多個 container 來執行
 * widgetName				: widget 的名稱如：textinput, selectinput
 * widgetEvent				: 要讓該 function [widgetHandler] 的執行時間在 widgetFunctionName 修改[ 前 | 後 ]
 * widgetFunctionName		: 該 widget 底下需要 bindle 的 functionName
 * widgetSwitch				: 要讓該 widgetHandler 啟動或停止，或者全部停止
 * widgetHandler			: 需要執行的 anonymous function 
 * 使用範例：
 * $.control( "autoform", $('div[column="acceptanceitem.installment"][class~="autoform_column"]'), "textinput", "before", "sync", "on", installmentHandler );
 */ 
(function($){
	$.control = function(){
		var options = {
			widgetPrefix		: "",
			widgetContainer		: "",			// id, class
			widgetName 			: "",			
			widgetEvent 		: "",			// single string
			widgetFunctionName 	: "",
			widgetSwitch		: "",
			widgetHandler		: {}
		}
		
		options.widgetPrefix = arguments[0]
		options.widgetContainer = arguments[1];
		options.widgetName = arguments[2];
		options.widgetEvent = arguments[3];
		options.widgetFunctionName = arguments[4];
		options.widgetSwitch = arguments[5];
		options.widgetHandler = arguments[arguments.length-1];
		
		var widgetContainer = options.widgetContainer;
		var widgetPrefix = options.widgetPrefix; 
		var widgetName = options.widgetName;
		var widgetEvent = options.widgetEvent;
		var widgetFunctionNameDefault = options.widgetFunctionName;
		var widgetFunctionName = options.widgetFunctionName.toLowerCase(); 
		var widgetSwitch = options.widgetSwitch;
		var widgetHandler = options.widgetHandler;
		
		if ( "undefined" == typeof $[widgetPrefix] ) return ;
		if ( "undefined" == typeof $[widgetPrefix][widgetName] ) return ;
		
		/**
 		 * 	1. 加入 widgetEvent + widgetFunctionName 的控制條件使用 on
		 * 	2. 判斷 widgetEvent [ before | after ]把 function 包裝進去指定物件，使用 extend 或 override
		 */ 
		
		// 這邊為呼叫方式使用 on | off | offall
		//var eventHandler = function(){
			if(widgetSwitch == 'on'){			
				//alert(widgetName + widgetEvent + widgetFunctionName);
				if(widgetContainer != null && "object" == typeof(widgetContainer)){
					$.each(widgetContainer, function(){
						//alert($(this).attr("id"));
						$(this).unbind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
						$(this).bind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
					//widgetContainer.on(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, widgetContainer.data(widgetName)));
				}else if(widgetContainer != null && "string" == typeof(widgetContainer)){
					$.each($( widgetContainer ), function(){
						$(this).unbind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
						$(this).bind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
					//$( widgetContainer ).on(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(widgetContainer).data(widgetName)));
				}else{
					$.each($( ':' + widgetPrefix + '-' + widgetName ), function(){
						$(this).unbind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
						$(this).bind(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
					//$( ':' + widgetPrefix + '-' + widgetName ).on(widgetName + widgetEvent + widgetFunctionName, widgetHandler);
				}
			}else if(widgetSwitch == 'off'){
				if(widgetContainer != null && "object" == typeof(widgetContainer)){
					$.each(widgetContainer, function(){
						$(this).off(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
				}else if(widgetContainer != null && "string" == typeof(widgetContainer)){
					$.each($( widgetContainer ), function(){
						$(this).off(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
				}else{
					$.each($( ':' + widgetPrefix + '-' + widgetName ), function(){
						$(this).off(widgetName + widgetEvent + widgetFunctionName, $.proxy(widgetHandler, $(this).data(widgetName)));
					});
				}
			}else if(widgetSwitch == 'offall'){
				if(widgetContainer != null && "object" == typeof(widgetContainer)){
					widgetContainer.off(widgetName + widgetEvent + widgetFunctionName, "**");
				}else if(widgetContainer != null && "string" == typeof(widgetContainer)){
					$( widgetContainer ).off(widgetName + widgetEvent + widgetFunctionName, "**");
				}else{
					$( ':' + widgetPrefix + '-' + widgetName ).off(widgetName + widgetEvent + widgetFunctionName, "**");
				}
			}
		//}
		
		// 要提供 off 的動作
		// 這邊加入 before | after 的動作
		if((widgetEvent == 'before' || widgetEvent == 'after') && 
			$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] != undefined){
			// 不存在才加入
			var oldWidgetHandler = $[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault];
			if( $[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault].toString()
					.indexOf('this._trigger("before" + widgetFunctionName);') == -1 &&
				$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault].toString()
					.indexOf('this._trigger("after" + widgetFunctionName);') == -1 ){
				$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] = function(){
					try{ this._trigger("before" + widgetFunctionName); } catch(e){alert( "before trigger("+widgetFunctionName+"):" + e)}
					try{ oldWidgetHandler.apply(this, arguments); } catch(e){alert( "invoke trigger("+widgetFunctionName+"):" + e)}
					try{ this._trigger("after" + widgetFunctionName); } catch(e){alert( "after trigger("+widgetFunctionName+"):" + e);alert(this)}
				}
			}
		//把 override 功能先捨棄掉
		}else if((widgetEvent == 'before' || widgetEvent == 'after') &&
			$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] == undefined){
			// 從無到有生出一個 function
			$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] = widgetHandler;
		}else if(widgetEvent == 'override' && 
			$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] != undefined){
			$[widgetPrefix][widgetName].prototype[widgetFunctionNameDefault] = widgetHandler;
		}else{
			// exception
			return;
		}
	}
}(jQuery));
