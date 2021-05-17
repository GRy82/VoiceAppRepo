// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const routeTree = require('./routeTree');
const sendText = require('./messaging');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log('request type: ' + handlerInput.requestEnvelope.request.type);
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Stallions Locker Room. What is your position and jersey number?'
        const reprompt = 'I didn\'t get that. What is your position, and your jersey number?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};

const PossessesUserInfoLaunchRequestHandler = {
    canHandle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        const jerseyNumber = sessionAttributes.hasOwnProperty('jerseyNumber') ? 
            sessionAttributes.jerseyNumber : 0;
        const position = sessionAttributes.hasOwnProperty('position') ? 
            sessionAttributes.position : null;

        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' &&
            jerseyNumber &&
            position;

    },
    handle(handlerInput){
        const jerseyNumber = sessionAttributes.hasOwnProperty('jerseyNumber') ? 
            sessionAttributes.jerseyNumber : 0;
        const position = sessionAttributes.hasOwnProperty('position') ? 
            sessionAttributes.position : null;
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;

        const speakOutput = `Welcome back ${position} number ${jerseyNumber}. Give me a route number to look up.`
        const speakReprompt = 'As an example, if you ask me what route number nine is, I will tell you it\'s a go route.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};


const CollectPlayerInfoIntentHandler = {
    canHandle(handlerInput){
        console.log('request type: ' + handlerInput.requestEnvelope.request.type);
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CollectPlayerInfoIntent';
    },
    handle(handlerInput){
        const jerseyNumber = handlerInput.requestEnvelope.request.intent.slots.jerseyNumber.value;
        const position = handlerInput.requestEnvelope.request.intent.slots.position.value;

        const attributesManager =  handlerInput.attributesManager;
        
        const playerAttributes = {
            "jerseyNumber": jerseyNumber,
            "position": position,
            "receiveTexts": null,
            "mobileNumber": null,
            "routeNumber": null
        };
        
        attributesManager.setSessionAttributes(playerAttributes);

        const speakReprompt = 'Just say yes, no, or never.';//make an intent handler for 'never' in the future that is stored as a preference.
        const speakOutput = `Thanks ${position} number ${jerseyNumber}. You will have the option to receive text messages 
                            at times when it may be helpful. Do we have permission to store your mobile number?`;
                            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};

const TextPermissionDeniedIntentHandler = {
    canHandle(handlerInput){
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ? 
            sessionAttributes.routeNumber : null;
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
            && !routeNumber;
    },
    handle(handlerInput){
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.receiveTexts = false;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        const speakOutput = 'Not a problem. Give me a route number to look up.';
        const reprompt = 'I can look up information about a route in the route tree. Just give me the number of that route.';
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(reprompt)
        .getResponse();
    }
};

const HasTextPermissionIntentHandler = {
    canHandle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ?
            sessionAttributes.routeNumber : null;
            
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RouteInfoIntent' &&  //create a yes intent
            !mobileNumber &&
            !routeNumber;
    },
    handle(handlerInput){
        const receiveTexts = true;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const playerAttributes = {
            "jerseyNumber": sessionAttributes.hasOwnProperty('jerseyNumber') ? sessionAttributes.jerseyNumber : null,
            "position": sessionAttributes.hasOwnProperty('position') ? sessionAttributes.position : null,
            "receiveTexts": true,
            "mobileNumber": null,
            "routeNumber": null
        };
        attributesManager.setSessionAttributes(playerAttributes);
        
        const speakOutput = "What is your mobile phone number?";
        const speakReprompt = 'I didn\'t get that. Please repeat your mobile number.';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};

//When setting persistent attributes, it seems to serve as a complete overwrite.
const CollectPlayerMobileNumberIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CollectPlayerMobileNumberIntent';
    },
    async handle(handlerInput){
        const mobileNumber = handlerInput.requestEnvelope.request.intent.slots.mobileNumber.value;
        
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const jerseyNumber = sessionAttributes.hasOwnProperty('jerseyNumber') ? 
            sessionAttributes.jerseyNumber : null;
        const position = sessionAttributes.hasOwnProperty('position') ?
            sessionAttributes.position : null;
        
        const playerAttributes = {
            "jerseyNumber": jerseyNumber,
            "position": position,
            "receiveTexts": true,
            "mobileNumber": mobileNumber,
            "routeNumber": null
        };
        
        attributesManager.setSessionAttributes(playerAttributes);

        const speakReprompt = 'As an example, if you ask me what route number nine is, I will tell you it\'s a go route.';
        const speakOutput = `Your mobile number has been saved. Give me a route to lookup in the route tree.`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};


const RouteLookupIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RouteLookupIntent';
    },
    handle(handlerInput) {
        const routeNumber = handlerInput.requestEnvelope.request.intent.slots.routeNumber.value;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const jerseyNumber = sessionAttributes.hasOwnProperty('jerseyNumber') ? 
            sessionAttributes.jerseyNumber : null;
        const position = sessionAttributes.hasOwnProperty('position') ?
            sessionAttributes.position : null;
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;
        const receiveTexts = sessionAttributes.hasOwnProperty('receiveTexts') ?
            sessionAttributes.receiveTexts : null;
        
        const playerAttributes = {
            "jerseyNumber": jerseyNumber,
            "position": position,
            "receiveTexts": receiveTexts,
            "mobileNumber": mobileNumber,
            "routeNumber": routeNumber
        };
        
        attributesManager.setSessionAttributes(playerAttributes);

        const speakReprompt = 'If you want more info, just say yes.';
        const speakOutput = `Route ${routeNumber} is a ${routeTree[routeNumber - 1].name}. Would you like to hear more about this route?`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};

const RouteInfoIntentHandler = {
    canHandle(handlerInput){
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ?
            sessionAttributes.routeNumber : null;
            
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RouteInfoIntent'//create a yes intent.
            && routeNumber;
    },
    async handle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = await attributesManager.getPersistentAttributes();
        
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ?
            sessionAttributes.routeNumber : null;
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;
        const receiveTexts = sessionAttributes.hasOwnProperty('receiveTexts') ?
            sessionAttributes.receiveTexts : null;
        
        let routeInfo = 'Sorry. Something went wrong. Try starting over.';
        if(routeNumber){
            routeInfo = routeTree[routeNumber - 1].info;
        }
        if(receiveTexts && mobileNumber){
            routeInfo += ' Would you like us to text you additional resources for this route? Just say more info.';
        }
        
        return handlerInput.responseBuilder
            .speak(routeInfo)
            .reprompt('Try saying more informaion.')
            .getResponse();
    }
};


const RequestTextIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RequestTextIntent';
    },
    async handle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = await attributesManager.getPersistentAttributes();
        
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ?
            sessionAttributes.routeNumber : null;
            
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;
        
        const text = 'Use the following link to see the route demonstrated: ' + routeTree[routeNumber - 1].textedUrl;
        let mobileFormatted = '+1' + mobileNumber;
        const response = sendText(mobileFormatted, text);
        let confirmation = 'The text message has been sent to your mobile number.'
        // if (response !== 'success'){
        //     confirmation = 'Sorry, the text message was not able to be sent.';
        // }
        return handlerInput.responseBuilder
            .speak(confirmation)
            .reprompt(confirmation)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        sessionAttributes.routeNumber = null;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetUserInfoInterceptor = {
    async process(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        sessionAttributes = await attributesManager.getPersistentAttributes() || {};
        
        const jerseyNumber = sessionAttributes.hasOwnProperty('jerseyNumber') ? 
            sessionAttributes.jerseyNumber : null;
            
        const position = sessionAttributes.hasOwnProperty('position') ?
            sessionAttributes.position : null;
        
        const receiveTexts = sessionAttributes.hasOwnProperty('receiveTexts') ?
            sessionAttributes.receiveTexts : null;
            
        const mobileNumber = sessionAttributes.hasOwnProperty('mobileNumber') ?
            sessionAttributes.mobileNumber : null;
            
        const routeNumber = sessionAttributes.hasOwnProperty('routeNumber') ?
            sessionAttributes.routeNumber : null;
         
        // catch(error){
        //     if (error.name !== 'ServiceError') 
        //         return handlerInput.responseBuilder.speak("There was a problem connecting to the service.").getResponse();
        // }

        attributesManager.setSessionAttributes(sessionAttributes);
    }
};

const SetUserInfoInterceptor = {
    async process(handlerInput){
        const attributesManager = handlerInput.attributesManager
        const sessionAttributes = attributesManager.getSessionAttributes();
        attributesManager.setPersistentAttributes(sessionAttributes);
        await attributesManager.savePersistentAttributes();
    }  
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        PossessesUserInfoLaunchRequestHandler,
        LaunchRequestHandler,
        CollectPlayerInfoIntentHandler,
        TextPermissionDeniedIntentHandler,
        HasTextPermissionIntentHandler,
        CollectPlayerMobileNumberIntentHandler,
        RouteLookupIntentHandler,
        RouteInfoIntentHandler,
        RequestTextIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler
        )
    .addRequestInterceptors(
        GetUserInfoInterceptor
    )
    .addResponseInterceptors(
        SetUserInfoInterceptor
    )
    .lambda();
