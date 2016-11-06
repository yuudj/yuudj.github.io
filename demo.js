angular.module('BlankApp', ['ngMaterial', 'ui.knob']).controller('AppCtrl', function ($scope) {
    var client;
    var topicBase = 'rb/ali/';
    $scope.evilMode = false;

    var temp = {
        topic: topicBase + 'sens/tem',
        value: 10,
        options: {

            size: 300,
            unit: 'C°',
            bgColor: 'rgba(0,0,0,0.3)',
            trackWidth: 50,
            barWidth: 30,
            barColor: '#FFAE1A',
            trackColor: 'rgba(0,0,0,.1)',
            prevBarColor: 'rgba(0,0,0,.2)',
            textColor: '#eee',
            scale: {
                enabled: true,
                type: 'lines',
                width: 3
            },
            subText: {
                enabled: true,
                text: 'Temp'
            },
            step: 5,
            displayPrevious: true
        }
    };

    var hum = {
        topic: topicBase + 'sens/hamb',
        value: 10,
        options: {

            size: 300,
            unit: "%",
            bgColor: 'rgba(0,0,0,0.3)',
            trackWidth: 50,
            barWidth: 30,
            barColor: '#FFAE1A',
            trackColor: 'rgba(0,0,0,.1)',
            prevBarColor: 'rgba(0,0,0,.2)',
            textColor: '#eee',
            scale: {
                enabled: true,
                type: 'dots',
                width: 3
            },
            step: 5,
            subText: {
                enabled: true,
                text: 'Humidity'
            },
            displayPrevious: true
        }
    };

    var pir = {
        topic: topicBase + 'sens/pir',
        value: 10
    }


    $scope.hum = hum;
    $scope.temp = temp;
    $scope.pir = pir;

    connect('broker.hivemq.com', 8000, 'elcosito-client');

    /****************/
    /*MQTT FUNCTIONS*/
    /****************/

    function connect(hostname, port, clientId) {
        console.info('Connecting to Server: Hostname: ', hostname, '. Port: ', port, '. Client ID: ', clientId);
        try {


            client = new Paho.MQTT.Client(hostname, Number(port), clientId);
            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;

            // connect the client
            client.connect({
                onSuccess: onConnect,
                onFailure: onConnectFail,
                invocationContext: { host: hostname, port: port, clientId: clientId }
            });
        }
        catch (error) {
            console.log(error);
        }


    }

    function disconnect() {
        if (client) {
            try {
                console.info('Disconnecting from Server');
                client.disconnect();
            } catch (error) {

            }

        }
    }

    function publish(topic, qos, message) {
        //console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
        message = new Paho.MQTT.Message(message);
        message.destinationName = topic;
        message.qos = Number(qos);
        client.send(message);
    }


    function subscribe(topic, qos) {
        //console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
        client.subscribe(topic, { qos: Number(qos) });
    }

    function unsubscribe(topic) {

        //console.info('Unsubscribing from ', topic);

        client.unsubscribe(topic, {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: topic }
        });
    }

    /***********************/
    /*MQTT CLIENT CALLBACKS*/
    /***********************/
    function unsubscribeSuccess(context) {
        console.info('Successfully unsubscribed from ', context.invocationContext.topic);
    }

    function unsubscribeFailure(context) {
        console.error('Failed to  unsubscribe from ', context.invocationContext.topic);
    }


    // called when the client connects
    function onConnect(context) {
        // Once a connection has been made, make a subscription and send a message.
        console.info("Client Connected");
        subscribe(topicBase + '#', '1')

    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.error("Connection Lost: " + responseObject.errorMessage);
            reconnect();
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        var destinationName = new String(message.destinationName);
        var numericPayload = new Number(message.payloadString);

        console.log("mensaje : " + destinationName + "|" + numericPayload)
        if (destinationName.startsWith(topicBase + 'evil')) {
              $scope.$apply(function () {
                    $scope.evilMode=!$scope.evilMode ;
                });
             
            return;
        }


        var dev = [hum, temp, pir];
        dev.forEach(function (element) {
            if (destinationName.startsWith(element.topic)) {
                $scope.$apply(function () {
                    element.value = numericPayload;
                });

            }
        }, this);


    }

    function onConnectFail(invocationContext, errorCode, errorMessage) {

        if (errorCode !== 0) {
            //reconnect();
        }
    }


    function reconnect() {
        //console.info("Reconectando en 5 segundos");
        //$timeout(function(){
        // connect(server.host, Number(server.port), "123467898765"); 
        //}, 5000);

    }
});

