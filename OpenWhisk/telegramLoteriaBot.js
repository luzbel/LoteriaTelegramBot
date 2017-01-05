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
			var output='NO se ha recibido inline_query en el update envíado por Telegram';
			console.log('telegramMessageAction:',output);
			if (    (update.message && update.message.chat && update.message.chat.id) ||
				(update.edited_message && update.edited_message.chat && update.edited_message.chat.id) ) {
				var chat_id;
				if (update.message) {
					chat_id=update.message.chat.id;
				} else {
					chat_id=update.edited_message.chat.id;
				}
				// ENVIAR RESPUESTA A TELEGRAM
				// el texto lo guardamos en base64 debido a https://github.com/openwhisk/openwhisk/issues/252
				var textBase64='RXN0ZSBib3QgKk5PIG9maWNpYWwqIHBlcm1pdGUgY29uc3VsdGFyIGxvcyBwcmVtaW9zIGRlIG7Dum1lcm9zIGVuIGVsIHNvcnRlbyBkZWwgbmnDsW8geSBOYXZpZGFkIHNpbiBuZWNlc2lkYWQgZGUgYcOxYWRpcmxvIGEgbmluZ8O6biBjaGF0IG8gZ3J1cG8uIFNpbXBsZW1lbnRlIGVzY3JpYmUgQExvdGVyaWFOaW5vXF9CT1QgbyBATG90ZXJpYU5hdmlkYWRcX0JPVCBlbiBjdWFscXVpZXIgY2hhdCB5IGVzY3JpYmUgbHVlZ28gbGFzIDUgY2lmcmFzIGRlbCBuw7ptZXJvIGEgY29uc3VsdGFyIChzaW4gbGxlZ2FyIGEgZW52aWFyIGVsIG1lbnNhamUpLg0KDQoNCkVsIGJvdCBubyBlbXBlemFyw6EgYSBidXNjYXIgeSBkZXZvbHZlciByZXN1bHRhZG9zIGhhc3RhIHF1ZSBubyBoYXlhcyBlc2NyaXRvIGxhcyBjaW5jbyBjaWZyYXMuDQoNCg0KRXNwZXJhIHVuIHBvY28gYSBxdWUgc2UgcmVhbGljZSBsYSBjb25zdWx0YSBkZWwgbsO6bWVybyB5IHNlIGFicmlyw6EgdW4gcGFuZWwgY29uIGluZm9ybWFjacOzbiBzb2JyZSBlbCBlc3RhZG8gZGVsIHNvcnRlbyB5IGVsIHByZW1pbyBjb3JyZXNwb25kaWVudGUuIFB1ZWRlcyBzZWxlY2Npb25hciBwYXJhIGVudmlhciBlbCByZXN1bHRhZG8gYWwgY2hhdC4NCg0KDQoqUG9yIGVqZW1wbG8sIHBydWViYSBhIHRlY2xlYXIgYXF1w60gbWlzbW8gKkBMb3RlcmlhTmF2aWRhZFxfQk9UIDY2NTEzDQoNCg0Kw5pzYWxvIGJham8gdHUgcHJvcGlvIHJpZXNnbywgc2UgdHJhdGEgZGUgdW4gcHJvZHVjdG8gZW4gcHJ1ZWJhcyBzaW4gbmluZ3VuYSBnYXJhbnTDrWEuIE5vIG5vcyBoYWNlbW9zIHJlc3BvbnNhYmxlcyBkZSBuaW5ndW5hIHDDqXJkaWRhIGRlcml2YWRhIGRlIHN1IHVzby4NCg0KDQoqTGEgw7puaWNhIGxpc3RhIG9maWNpYWwgZXMgbGEgcXVlIHB1YmxpY2EgbGEgKltPTkxBRV0oaHR0cDovL3d3dy5sb3Rlcmlhc3lhcHVlc3Rhcy5lcy9lcykqIHkgZGViZXLDrWFzIGNvbXByb2JhciB0b2RvcyB0dXMgbsO6bWVyb3MgY29udHJhIGVsbGEuKg0KDQoNCkxhIGluZm9ybWFjacOzbiBkZSBsb3MgcHJlbWlvcyBlcyBvYnRlbmlkYSBkZSBsYXMgQVBJcyBww7pibGljYSBwcm9wb3JjaW9uYWRvIHBvciBlbCBwZXJpw7NkaWNvIFsiRWwgUGHDrXMiXShodHRwOi8vZWxwYWlzLmNvbS8pIHBhcmEgZWwgc29ydGVvIGRlIFtOYXZpZGFkXShodHRwOi8vc2VydmljaW9zLmVscGFpcy5jb20vc29ydGVvcy9sb3RlcmlhLW5hdmlkYWQvYXBpLykgeSBlbCBzb3J0ZW8gZGVsIFtOacOxb10oaHR0cDovL3NlcnZpY2lvcy5lbHBhaXMuY29tL3NvcnRlb3MvbG90ZXJpYS1kZWwtbmluby9hcGkvKSwgcGVybyBlbCBCT1Qgbm8gZXN0w6EgdmluY3VsYWRvIGEgIkVsIFBhw61zIg==';
				var utf8text = new Buffer(textBase64, 'base64').toString('utf-8');
				
				var options = {
					method: 'POST',
					url: 'https://api.telegram.org/bot'+update.botToken+'/sendMessage',
					headers: {
						'Content-Type': 'application/json'
					},
					json: { 
						"chat_id": chat_id,
						"text":  utf8text,
						// hay que escapar caracteres como _ 
						/*
"Este bot *NO oficial* permite consultar los premios de números en el sorteo del niño y Navidad sin necesidad de añadirlo a ningún chat o grupo. "+
"Simplemente escribe \\@LoteriaNino\\_BOT o \\@LoteriaNavidad\\_BOT en cualquier chat y escribe luego las 5 cifras del número a consultar (sin llegar a enviar el mensaje)."+
"\n\n"+
"El bot no empezará a buscar y devolver resultados hasta que no hayas escrito las cinco cifras."+
"\n\n"+
"Espera un poco a que se realice la consulta del número y se abrirá un panel con información sobre el estado del sorteo y el premio correspondiente. Puedes seleccionar para enviar el resultado al chat."+
"\n\n"+
"*Por ejemplo, prueba a teclear aquí mismo \\@LoteriaNavidad\\_BOT 66513*"+
"\n\n"+
"Úsalo bajo tu propio riesgo, se trata de un producto en pruebas sin ninguna garantía. No nos hacemos responsables de ninguna pérdida derivada de su uso."+
"\n\n"+
"*La unica lista oficial es la que publica la *[ONLAE](http://www.loteriasyapuestas.es/es)* y deberias comprobar todos tus numeros contra ella.*"+
"\n\n"+
"La información de los premios es obtenida de las APIs pública proporcionado por el periódico [\"El País\"](http://elpais.com/) para el sorteo de [Navidad](http://servicios.elpais.com/sorteos/loteria-navidad/api/) y el sorteo del [Niño](http://servicios.elpais.com/sorteos/loteria-del-nino/api/), pero el BOT no está vinculado a \"El País\"",
*/
						"parse_mode": "Markdown"
					}
				};
				request(options, function(error, response, body) {
					if (error) {
						console.log('telegramMessageAction:','Error al enviar ayuda a Telegram');
						reject(error);
					}
					else { 
						console.log('telegramMessageAction:','OK, enviada respuesta con ayuda a Telegram');
						var output = 'OK, áéíóú debera haber llegado la respuesta a Telegram';
						resolve({msg: output}); 
					}
				});                
			} else {
			  output='Tampoco se ha recibido message o edited_message con chat.id';
			  console.log('telegramMessageAction:',output);
			  resolve({msg: output}); 
			}
			//resolve({msg: output}); 
		} else {

		if (!update.inline_query.query) {
			var output='No se ha recibido query en la inline_query envíada por Telegram';
			console.log('telegramMessageAction:',output);
			resolve({msg: output}); 
		}

		if (update.inline_query.query.length!=5) {
			// ¿se podría y debería hacer esta comprobacin en el API y no aqu. Seguramente cuando se manejen más comandos no
			var output='No se ha recibido el número completo';
			console.log('telegramMessageAction:',output);
			resolve({msg: output}); 
		}

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

			console.log('telegramMessageAction:','OK al consultar la loteria');
			var respJSON = body.replace('busqueda=','');
			var resp = JSON.parse(respJSON);
			var description;
			var texto;
		    var descBase64;

			if (resp.error!=0) {
				console.log('telegramMessageAction:','el API de loteria ha devuelto error '+resp.error);
				// description = 'Ups, no hemos conseguido consultar el número. Intentalo más tarde';
				descBase64='VXBzLCBubyBoZW1vcyBjb25zZWd1aWRvIGNvbnN1bHRhciBlbCBuw7ptZXJvLiBJbnRlbnRhbG8gbcOhcyB0YXJkZQ==';
				texto = '';
			} else {
				console.log('telegramMessageAction:','ok, el API de loteria ha devuelto error '+resp.error);

				// TODO Falta poner los acentos cuando funcionen en OpenWhisk
				switch(resp.status)
				{
					case 0: //description = 'El sorteo no ha comenzado aun. Todos los numeros aparecen como no premiados. ';
					    descBase64 = 'RWwgc29ydGVvIG5vIGhhIGNvbWVuemFkbyBhw7puLiBUb2RvcyBsb3MgbsO6bWVyb3MgYXBhcmVjZW4gY29tbyBubyBwcmVtaWFkb3MuIA==';					    
						break;
					case 1: // description = 'El sorteo ha empezado. La lista de numeros premiados se va cargando poco a poco. Un numero premiado podria llegar a tardar unos minutos en aparecer. ';
					    descBase64 = 'RWwgc29ydGVvIGhhIGVtcGV6YWRvLiBMYSBsaXN0YSBkZSBuw7ptZXJvcyBwcmVtaWFkb3Mgc2UgdmEgY2FyZ2FuZG8gcG9jbyBhIHBvY28uIFVuIG51bWVybyBwcmVtaWFkbyBwb2Ryw61hIGxsZWdhciBhIHRhcmRhciB1bm9zIG1pbnV0b3MgZW4gYXBhcmVjZXIuIA==';
						break;
					case 2: // description = 'El sorteo ha terminado y la lista de numeros y premios deberia ser la correcta aunque, tomada al oido, no podemos estar seguros de ella. ';
					    descBase64 = 'RWwgc29ydGVvIGhhIHRlcm1pbmFkbyB5IGxhIGxpc3RhIGRlIG7Dum1lcm9zIHkgcHJlbWlvcyBkZWJlcsOtYSBzZXIgbGEgY29ycmVjdGEgYXVucXVlLCB0b21hZGEgYWwgb8OtZG8sIG5vIHBvZGVtb3MgZXN0YXIgc2VndXJvcyBkZSBlbGxhLiA=';
						break;
					case 3: // description = 'El sorteo ha terminado y existe una lista oficial en PDF. ';
					    descBase64 = 'RWwgc29ydGVvIGhhIHRlcm1pbmFkbyB5IGV4aXN0ZSB1bmEgbGlzdGEgb2ZpY2lhbCBlbiBQREYuIA==';
						break;
					case 4: // description = 'El sorteo ha terminado y la lista de numeros y premios esta basada en la oficial. De todas formas, recuerda que la unica lista oficial es la que publica la ONLAE y deberias comprobar todos tus numeros contra ella. ';
					    descBase64 = 'RWwgc29ydGVvIGhhIHRlcm1pbmFkbyB5IGxhIGxpc3RhIGRlIG7Dum1lcm9zIHkgcHJlbWlvcyBlc3RhIGJhc2FkYSBlbiBsYSBvZmljaWFsLiBEZSB0b2RhcyBmb3JtYXMsIHJlY3VlcmRhIHF1ZSBsYSDDum5pY2EgbGlzdGEgb2ZpY2lhbCBlcyBsYSBxdWUgcHVibGljYSBsYSBPTkxBRSB5IGRlYmVyw61hcyBjb21wcm9iYXIgdG9kb3MgdHVzIG7Dum1lcm9zIGNvbnRyYSBlbGxhLiA=';
						break;
					default:
						// description = 'No tenemos ni idea de como va el sorteo. ';
						descBase64 = 'Tm8gdGVuZW1vcyBuaSBpZGVhIGRlIGNvbW8gdmEgZWwgc29ydGVvLiA=';
				}

				
				// texto = '*El premio al decimo del numero '+ resp.numero+' es de '+resp.premio+' euros.*'
				texto = new Buffer('KkVsIHByZW1pbyBhbCBkZWNpbW8gZGVsIG51bWVybyA=','base64').toString('utf-8')+resp.numero+' es de '+resp.premio+' euros.*'

			} // else no error al consultar el decimo a elpais
            description = new Buffer(descBase64, 'base64').toString('utf-8');

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
		});		
}
	}); // fin Promise
}
