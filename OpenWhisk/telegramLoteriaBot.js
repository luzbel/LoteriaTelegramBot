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
				var options = {
					method: 'POST',
					url: 'https://api.telegram.org/bot'+update.botToken+'/sendMessage',
					headers: {
						'Content-Type': 'application/json'
					},
					json: { 
						"chat_id": chat_id,
						"text":  // "*prueba*" ,
					//	 'prueba a teclear, sin enviar el mensaje, LoteriaNavidad_BOT 66513 ',
"Este bot NO oficial comprueba premios en los sorteos de Navidad y el nino en todos tus chats y grupos. "+chat_id,
//"Este bot NO oficial comprueba premios en el sorteo del nino en todos tus chats y grupos, por lo que no necesitas anadirlo. ",
//"prueba a teclear, sin enviar el mensaje, LoteriaNavidad_BOT 66513",
// "Este bot NO oficial comprueba premios en el sorteo del nino en todos tus chats y grupos, por lo que no necesitas anadirlo. ", // Simplemente escribe @LoteriaNino_BOT en cualquier chat y escribe luego el número a consultar (sin enviar). ", // Esto abrirá un panel con información sobre el estado del sorteo y el premio correspondiente, que puedes pulsar para enviar el resultado al chat. La unica lista oficial es la que publica la ONLAE y deberias comprobar todos tus numeros contra ella.",
		/*				
"Este bot *NO oficial* permite consultar los premios de números en el sorteo del niño y Navidad en todos tus chats y grupos, sin necesidad de añadirlo a ningún chat o grupo."+
"Simplemente escribe @LoteriaNino_BOT o @LoteriaNavidad_BOT en cualquier chat y escribe luego las 5 cifras del número a consultar (sin dar a enviar)."+
"\n"+
"El bot no empezará a buscar hasta que no hayas escrito las cinco cifras."+
"\n"+
"Esto abrirá un panel con información sobre el estado del sorteo y el premio correspondiente, que puedes pulsar para enviar el resultado al chat."+
"\n"+
"Por ejemplo, prueba a teclear @LoteriaNavidad_BOT 66513 aquí mismo"+
"\n"+
"*La unica lista oficial es la que publica la ONLAE y deberias comprobar todos tus numeros contra ella.*"+
"\n"+
"La información de los premios es obtenida de las API pública proporcionado por el periódico [\"El País\"](http://elpais.com/) para el sorteo de [Navidad](http://servicios.elpais.com/sorteos/loteria-navidad/api/) y el sorteo del [Niño](http://servicios.elpais.com/sorteos/loteria-del-nino/api/)", 
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
		});		
}
	}); // fin Promise
}
