# LoteriaTelegramBot
Bot de Telegram en pruebas **NO OFICIAL** para consultar los resultados de la lotería de navidad y el niño.

Podéis jugar con ellos (mientras la factura de Bluemix no se desmadre y los tenga que apagar) en [LoteriaNavidad_BOT](https://t.me/LoteriaNavidad_BOT) y [LoteriaNino_BOT](https://t.me/LoteriaNino_BOT).
No hace falta que añadáis el bot a ningún chat o grupo. Simplemente realizar la consulta *inline* del número desde cualquier chat de forma similar a como se usan otros famosos bots ([@gif](https://t.me/gif), [@sticker](https://t.me/sticker]), ...). Por ejemplo, si quieres consultar el número 95379 escribe en cualquier chat "@LoteriaNino_BOT 95379" (sin llegar a enviar el mensaje) y espera unos segundos a recibir los resultados. 

Por supuesto, no proporcionan ninguna información oficial y debes usarlos bajo tu propio riesgo, se trata de prototipos en pruebas sin ninguna garantía y no me hago responsable de ninguna pérdida derivada de su uso.

**La única lista oficial es la que publica la [ONLAE](http://www.loteriasyapuestas.es/es) y deberías comprobar todos tus números contra ella.**

Los bots usan el API proporcionado por el periódico ["El País"](http://elpais.com/) para consultar resultados del sorteo de [Navidad](http://servicios.elpais.com/sorteos/loteria-navidad/api/) y [el Niño](http://servicios.elpais.com/sorteos/loteria-del-nino/api/) y están desarrollados con tecnología serverless [OpenWhisk](openwhisk.org) y expuestos bajo [IBM API Connect](http://www-03.ibm.com/software/products/es/api-connect), pero no están vinculados en modo alguno al periódico ["El País"](http://www.elpais.com).
