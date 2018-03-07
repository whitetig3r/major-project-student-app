//
//  RCTChirpConnect.m
//  ChirpConnect
//
//  Created by Joe Todd on 19/02/2018.
//  Copyright © 2018 Asio Ltd. All rights reserved.
//

#import "RCTChirpConnect.h"

@implementation RCTChirpConnect

ChirpConnect *sdk;

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{
           @"CHIRP_CONNECT_STATE_STOPPED": [NSNumber numberWithInt:CHIRP_CONNECT_STATE_STOPPED],
           @"CHIRP_CONNECT_STATE_PAUSED": [NSNumber numberWithInt:CHIRP_CONNECT_STATE_PAUSED],
           @"CHIRP_CONNECT_STATE_RUNNING": [NSNumber numberWithInt:CHIRP_CONNECT_STATE_RUNNING],
           @"CHIRP_CONNECT_STATE_SENDING": [NSNumber numberWithInt:CHIRP_CONNECT_STATE_SENDING],
           @"CHIRP_CONNECT_STATE_RECEIVING": [NSNumber numberWithInt:CHIRP_CONNECT_STATE_RECEIVING]
           };
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
           @"onStateChanged",
           @"onSending",
           @"onSent",
           @"onReceiving",
           @"onReceived",
           @"onError"
           ];
}

/**
 * initWithLicence(key, secret, licence)
 *
 * Initialise the SDK with an application key, secret and licence string.
 * For Pro/Enterprise users to initialise offline.
 * Callbacks are also set up here.
 */
RCT_EXPORT_METHOD(initWithLicence:(NSString *)key secret:(NSString *)secret licence:(NSString *)licence
                         resolver:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
{
  sdk = [[ChirpConnect alloc] initWithAppKey:key
                                   andSecret:secret];
  [self setCallbacks];
  NSError *error = [sdk setLicenceString:licence];
  if (error) {
    reject(@"Error", @"Licence Error", error);
  } else {
    resolve(@"Initialisation Success");
  }
}

/**
 * init(key, secret)
 *
 * Initialise the SDK with an application key and secret.
 * Callbacks are also set up here.
 */
RCT_EXPORT_METHOD(init:(NSString *)key secret:(NSString *)secret
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  sdk = [[ChirpConnect alloc] initWithAppKey:key
                                   andSecret:secret];
  
  [self setCallbacks];
  [sdk setAuthenticationStateUpdatedBlock:^(NSError * _Nullable error) {
    if (error) {
      reject(@"Error", @"Authentication Error", error);
    } else {
      resolve(@"Initialisation Success");
    }
  }];
}

- (void)setCallbacks
{
  [sdk setShouldRouteAudioToBluetoothPeripherals:YES];
  
  [sdk setStateUpdatedBlock:^(CHIRP_CONNECT_STATE oldState,
                              CHIRP_CONNECT_STATE newState)
   {
     [self sendEventWithName:@"onStateChanged" body:@{@"status": [NSNumber numberWithInt:newState]}];
   }];
  
  [sdk setSendingBlock:^(NSData * _Nonnull data)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onSending" body:@{@"data": payload}];
   }];
  
  [sdk setSentBlock:^(NSData * _Nonnull data)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onSent" body:@{@"data": payload}];
   }];
  
  [sdk setReceivingBlock:^(void)
   {
     [self sendEventWithName:@"onReceiving" body:@{}];
   }];
  
  [sdk setReceivedBlock:^(NSData * _Nonnull data)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onReceived" body:@{@"data": payload}];
   }];
}

/**
 * setLicence(licence)
 *
 * Configure the SDK with a licence string.
 */
RCT_EXPORT_METHOD(setLicence:(NSString *)licence)
{
  NSError *err = [sdk setLicenceString:licence];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * start()
 *
 * Starts the SDK.
 */
RCT_EXPORT_METHOD(start)
{
  NSError *err = [sdk start];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * stop()
 *
 * Stops the SDK.
 */
RCT_EXPORT_METHOD(stop)
{
  NSError *err = [sdk stop];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * send(data)
 *
 * Sends a payload of NSData to the speaker.
 */
RCT_EXPORT_METHOD(send: (NSArray *)data)
{
  NSData *payload = [self arrayToData: data];
  NSError *err = [sdk send:payload];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * sendRandom()
 *
 * Sends a random payload to the speaker.
 */
RCT_EXPORT_METHOD(sendRandom)
{
  NSUInteger length = 1 + arc4random() % (sdk.maxPayloadLength - 1);
  NSData *data = [sdk randomPayloadWithLength:length];
  NSError *err = [sdk send:data];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * dataToArray
 *
 * Internal function to convert NSData payloads
 * to NSArray of bytes. React Native doesn't support NSData.
 */
- (NSArray *)dataToArray: (NSData *) data
{
  Byte *bytes = (Byte*)[data bytes];
  NSMutableArray *payload = [NSMutableArray arrayWithCapacity:data.length];
  for (int i = 0; i < data.length; i++) {
    [payload addObject:[NSNumber numberWithInt:bytes[i]]];
  }
  return [NSArray arrayWithArray:payload];
}

/**
 * arrayToData
 *
 * Internal function to convert NSArray payloads
 * to NSData. React Native doesn't support NSData.
 */
- (NSData *)arrayToData: (NSArray *) array
{
  Byte bytes[[array count]];
  for (int i = 0; i < [array count]; i++) {
    bytes[i] = [[array objectAtIndex:i] integerValue];
  }
  NSData *payload = [[NSData alloc] initWithBytes:bytes length:[array count]];
  return payload;
}

@end

