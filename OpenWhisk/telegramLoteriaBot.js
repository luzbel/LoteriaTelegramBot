var request = require('request');

/**
  *
  * main() will be invoked when you Run This Action.
  * 
  * @param Whisk actions accept a single parameter,
  *        which must be a JSON object.
  *
  * In this case, the params variable will look like:
  *     { "message": "xxxx" }
  *
  * @return which must be a JSON object.
  *         It will be the output of this action.
  *
  */ 
function main(update) {
   return new Promise(function(resolve, reject) {
   
    if (!update.targetURL) {
      var output='No se ha recibido Target URL desde API Connect';
      console.log('telegramMessageAction:',output);
      reject({msg: output});       
    }
    
    if (!update.botToken) {
      var output='No se ha recibido botToken desde API Connect';
      console.log('telegramMessageAction:',output);
      reject({msg: output});       
    }

    if (!update.inline_query) {
      // Falta comprobar si se trata de un update.message o update.edited_message
      var output='No se ha recibido inline_query en el update envíado por Telegram';
      console.log('telegramMessageAction:',output);
      resolve({msg: output}); 
    } else {
      if (!update.inline_query.query) {
	    var output='No se ha recibido query en la inline_query envíada por Telegram';
	    console.log('telegramMessageAction:',output);
	    resolve({msg: output}); 
      } else {
        if (update.inline_query.query.length!=5) {
          // ¿se podría y debería hacer esta comprobacin en el API y no aqu. Seguramente cuando se manejen más comandos no
	      var output='No se ha recibido el número completo';
	      console.log('telegramMessageAction:',output);
	      resolve({msg: output}); 
        } else {
            // FALTA COMPROBAR QUE ES UN NUMERO
			// CONSULTAR NUMERO
          var options = {
            method: 'GET',
            //url: 'http://api.elpais.com/ws/LoteriaNinoPremiados?n='+update.inline_query.query,
            //url: 'http://api.elpais.com/ws/LoteriaNavidadPremiados?n='+update.inline_query.query,
			url: update.targetURL+update.inline_query.query,
            headers: {
              'Content-Type': 'application/json',
              'Accept':'application/json'
            }
          };

          request(options, function(error, response, body) {
            if (error) {
              console.log('telegramMessageAction:','Error al consultar la loteria');
              reject(error);
            }
            else { 
              console.log('telegramMessageAction:','OK al consultar la loteria');
              var respJSON = body.replace('busqueda=','');
              var resp = JSON.parse(respJSON);
	      var description;
	      var texto;
              if (resp.error!=0) {
                console.log('telegramMessageAction:','el API de loteria ha devuelto error '+resp.error);
		        description = 'Ups, no hemos conseguido consultar el número. Intentalo más tarde';
		        texto = '';
              } else {
                console.log('telegramMessageAction:','ok, el API de loteria ha devuelto error '+resp.error);
                
                // TODO Falta poner los acentos cuando funcionen en OpenWhisk
		        switch(resp.status)
	  	        {
			      case 0: description = 'El sorteo no ha comenzado aun. Todos los numeros aparecen como no premiados. ';
				    break;
			      case 1: description = 'El sorteo ha empezado. La lista de numeros premiados se va cargando poco a poco. Un numero premiado podria llegar a tardar unos minutos en aparecer. ';
				    break;
			      case 2: description = 'El sorteo ha terminado y la lista de numeros y premios deberia ser la correcta aunque, tomada al oido, no podemos estar seguros de ella. ';
				    break;
			      case 3: description = 'El sorteo ha terminado y existe una lista oficial en PDF. ';
				    break;
			      case 4: description = 'El sorteo ha terminado y la lista de numeros y premios esta basada en la oficial. De todas formas, recuerda que la unica lista oficial es la que publica la ONLAE y deberias comprobar todos tus numeros contra ella. ';
				    break;
			      default:
				    description = 'No tenemos ni idea de como va el sorteo. ';
		         }
		         
		         texto = '*El premio al decimo del numero '+ resp.numero+' es de '+resp.premio+' euros.*'
		
		       } // else no error al consultar el decimo a elpais
		    
		// ENVIAR RESPUESTA A TELEGRAM
	        var options = {
                    method: 'POST',
                    url: 'https://api.telegram.org/bot'+update.botToken+'/answerInlineQuery',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    json: { 
                      "inline_query_id": update.inline_query.id,
                      "results" : [
                        {
                          "type" : "article" ,
                          "id": "1" ,
                          "title": "Advertencia sobre estado sorteo" ,
                          "input_message_content" : { 
                            "message_text" : description ,
                            "parse_mode" : "Markdown" ,
                            //"parse_mode" : "HTML" ,
                            "disable_web_page_preview" : true
                          },
                          "description": description
                        },
                        {
                          "type" : "article" ,
                          "id": "2" ,
                          "title": "Resultado" ,
                          "input_message_content" : { 
                            "message_text" : description+texto ,
                            "parse_mode" : "Markdown" ,
                            //"parse_mode" : "HTML" ,
                            "disable_web_page_preview" : true
                          },
                          "description": texto
                        },
                      ]
                    }
                  };

                  request(options, function(error, response, body) {
                    if (error) {
                      console.log('telegramMessageAction:','Error al enviar respuesta a Telegram y elPais devolvio '+resp.error);
                      reject(error);
                    }
                    else { 
                      console.log('telegramMessageAction:','OK, enviada respuesta a Telegram y elPais devolvio '+resp.error);
                      var output = 'OK, áéíóú debera haber llegado la respuesta a Telegram';
                      resolve({msg: output}); 
                    }
                  });                
              // } // este
            }
          });			
        } // fin comprobar numero
      } // fin no se ha recibido query
    } // fin no se ha recibido inline_query 
   }); // fin Promise
}
