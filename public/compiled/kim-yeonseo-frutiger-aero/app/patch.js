
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
let IT_FRAME = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
let INPUT = createFloatArray(0)
let OUTPUT = createFloatArray(0)
const G_sked_ID_NULL = -1
const G_sked__ID_COUNTER_INIT = 1
const G_sked__MODE_WAIT = 0
const G_sked__MODE_SUBSCRIBE = 1


function G_sked_create(isLoggingEvents) {
                return {
                    eventLog: new Set(),
                    events: new Map(),
                    requests: new Map(),
                    idCounter: G_sked__ID_COUNTER_INIT,
                    isLoggingEvents,
                }
            }
function G_sked_wait(skeduler, event, callback) {
                if (skeduler.isLoggingEvents === false) {
                    throw new Error("Please activate skeduler's isLoggingEvents")
                }

                if (skeduler.eventLog.has(event)) {
                    callback(event)
                    return G_sked_ID_NULL
                } else {
                    return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
                }
            }
function G_sked_waitFuture(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
            }
function G_sked_subscribe(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_SUBSCRIBE)
            }
function G_sked_emit(skeduler, event) {
                if (skeduler.isLoggingEvents === true) {
                    skeduler.eventLog.add(event)
                }
                if (skeduler.events.has(event)) {
                    const skedIds = skeduler.events.get(event)
                    const skedIdsStaying = []
                    for (let i = 0; i < skedIds.length; i++) {
                        if (skeduler.requests.has(skedIds[i])) {
                            const request = skeduler.requests.get(skedIds[i])
                            request.callback(event)
                            if (request.mode === G_sked__MODE_WAIT) {
                                skeduler.requests.delete(request.id)
                            } else {
                                skedIdsStaying.push(request.id)
                            }
                        }
                    }
                    skeduler.events.set(event, skedIdsStaying)
                }
            }
function G_sked_cancel(skeduler, id) {
                skeduler.requests.delete(id)
            }
function G_sked__createRequest(skeduler, event, callback, mode) {
                const id = G_sked__nextId(skeduler)
                const request = {
                    id, 
                    mode, 
                    callback,
                }
                skeduler.requests.set(id, request)
                if (!skeduler.events.has(event)) {
                    skeduler.events.set(event, [id])    
                } else {
                    skeduler.events.get(event).push(id)
                }
                return id
            }
function G_sked__nextId(skeduler) {
                return skeduler.idCounter++
            }
const G_commons__ARRAYS = new Map()
const G_commons__ARRAYS_SKEDULER = G_sked_create(false)
function G_commons_getArray(arrayName) {
            if (!G_commons__ARRAYS.has(arrayName)) {
                throw new Error('Unknown array ' + arrayName)
            }
            return G_commons__ARRAYS.get(arrayName)
        }
function G_commons_hasArray(arrayName) {
            return G_commons__ARRAYS.has(arrayName)
        }
function G_commons_setArray(arrayName, array) {
            G_commons__ARRAYS.set(arrayName, array)
            G_sked_emit(G_commons__ARRAYS_SKEDULER, arrayName)
        }
function G_commons_subscribeArrayChanges(arrayName, callback) {
            const id = G_sked_subscribe(G_commons__ARRAYS_SKEDULER, arrayName, callback)
            if (G_commons__ARRAYS.has(arrayName)) {
                callback(arrayName)
            }
            return id
        }
function G_commons_cancelArrayChangesSubscription(id) {
            G_sked_cancel(G_commons__ARRAYS_SKEDULER, id)
        }
G_commons_setArray("sample_bloop", createFloatArray(1000))
G_commons_getArray("sample_bloop").set([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
G_commons_setArray("sample_water", createFloatArray(1000))
G_commons_getArray("sample_water").set([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
G_commons_setArray("sample_pop", createFloatArray(1000))
G_commons_getArray("sample_pop").set([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
G_commons_setArray("sample_chirp", createFloatArray(1000))
G_commons_getArray("sample_chirp").set([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
const G_commons__FRAME_SKEDULER = G_sked_create(false)
function G_commons__emitFrame(frame) {
            G_sked_emit(G_commons__FRAME_SKEDULER, frame.toString())
        }
function G_commons_waitFrame(frame, callback) {
            return G_sked_waitFuture(G_commons__FRAME_SKEDULER, frame.toString(), callback)
        }
function G_commons_cancelWaitFrame(id) {
            G_sked_cancel(G_commons__FRAME_SKEDULER, id)
        }
const G_msg_FLOAT_TOKEN = "number"
const G_msg_STRING_TOKEN = "string"
function G_msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === G_msg_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === G_msg_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function G_msg_getLength(message) {
                    return message.length
                }
function G_msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function G_msg_isStringToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'string'
                }
function G_msg_isFloatToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'number'
                }
function G_msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => G_msg_getTokenType(message, i) === tokenTypes[i])
                }
function G_msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_floats(values) {
                    return values
                }
function G_msg_strings(values) {
                    return values
                }
function G_msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function G_msg_VOID_MESSAGE_RECEIVER(m) {}
let G_msg_EMPTY_MESSAGE = G_msg_create([])
function G_bangUtils_isBang(message) {
            return (
                G_msg_isStringToken(message, 0) 
                && G_msg_readStringToken(message, 0) === 'bang'
            )
        }
function G_bangUtils_bang() {
            const message = G_msg_create([G_msg_STRING_TOKEN, 4])
            G_msg_writeStringToken(message, 0, 'bang')
            return message
        }
function G_bangUtils_emptyToBang(message) {
            if (G_msg_getLength(message) === 0) {
                return G_bangUtils_bang()
            } else {
                return message
            }
        }
const G_msgBuses__BUSES = new Map()
function G_msgBuses_publish(busName, message) {
            let i = 0
            const callbacks = G_msgBuses__BUSES.has(busName) ? G_msgBuses__BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function G_msgBuses_subscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                G_msgBuses__BUSES.set(busName, [])
            }
            G_msgBuses__BUSES.get(busName).push(callback)
        }
function G_msgBuses_unsubscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                return
            }
            const callbacks = G_msgBuses__BUSES.get(busName)
            const found = callbacks.indexOf(callback)
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
function G_tokenConversion_toFloat(m, i) {
        if (G_msg_isFloatToken(m, i)) {
            return G_msg_readFloatToken(m, i)
        } else {
            return 0
        }
    }
function G_tokenConversion_toString_(m, i) {
        if (G_msg_isStringToken(m, i)) {
            const str = G_msg_readStringToken(m, i)
            if (str === 'bang') {
                return 'symbol'
            } else {
                return str
            }
        } else {
            return 'float'
        }
    }
function G_funcs_mtof(value) {
        return value <= -1500 ? 0: (value > 1499 ? 3.282417553401589e+38 : Math.pow(2, (value - 69) / 12) * 440)
    }
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit.slice(0, 3) === 'per') {
            if (amount !== 0) {
                amount = 1 / amount
            }
            unit = unit.slice(3)
        }

        if (unit === 'msec' || unit === 'milliseconds' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }

function G_points_interpolateLin(x, p0, p1) {
        return p0.y + (x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x)
    }

function G_linesUtils_computeSlope(p0, p1) {
            return p1.x !== p0.x ? (p1.y - p0.y) / (p1.x - p0.x) : 0
        }
function G_linesUtils_removePointsBeforeFrame(points, frame) {
            const newPoints = []
            let i = 0
            while (i < points.length) {
                if (frame <= points[i].x) {
                    newPoints.push(points[i])
                }
                i++
            }
            return newPoints
        }
function G_linesUtils_insertNewLinePoints(points, p0, p1) {
            const newPoints = []
            let i = 0
            
            // Keep the points that are before the new points added
            while (i < points.length && points[i].x <= p0.x) {
                newPoints.push(points[i])
                i++
            }
            
            // Find the start value of the start point :
            
            // 1. If there is a previous point and that previous point
            // is on the same frame, we don't modify the start point value.
            // (represents a vertical line).
            if (0 < i - 1 && points[i - 1].x === p0.x) {

            // 2. If new points are inserted in between already existing points 
            // we need to interpolate the existing line to find the startValue.
            } else if (0 < i && i < points.length) {
                newPoints.push({
                    x: p0.x,
                    y: G_points_interpolateLin(p0.x, points[i - 1], points[i])
                })

            // 3. If new line is inserted after all existing points, 
            // we just take the value of the last point
            } else if (i >= points.length && points.length) {
                newPoints.push({
                    x: p0.x,
                    y: points[points.length - 1].y,
                })

            // 4. If new line placed in first position, we take the defaultStartValue.
            } else if (i === 0) {
                newPoints.push({
                    x: p0.x,
                    y: p0.y,
                })
            }
            
            newPoints.push({
                x: p1.x,
                y: p1.y,
            })
            return newPoints
        }
function G_linesUtils_computeFrameAjustedPoints(points) {
            if (points.length < 2) {
                throw new Error('invalid length for points')
            }

            const newPoints = []
            let i = 0
            let p = points[0]
            let frameLower = 0
            let frameUpper = 0
            
            while(i < points.length) {
                p = points[i]
                frameLower = Math.floor(p.x)
                frameUpper = frameLower + 1

                // I. Placing interpolated point at the lower bound of the current frame
                // ------------------------------------------------------------------------
                // 1. Point is already on an exact frame,
                if (p.x === frameLower) {
                    newPoints.push({ x: p.x, y: p.y })

                    // 1.a. if several of the next points are also on the same X,
                    // we find the last one to draw a vertical line.
                    while (
                        (i + 1) < points.length
                        && points[i + 1].x === frameLower
                    ) {
                        i++
                    }
                    if (points[i].y !== newPoints[newPoints.length - 1].y) {
                        newPoints.push({ x: points[i].x, y: points[i].y })
                    }

                    // 1.b. if last point, we quit
                    if (i + 1 >= points.length) {
                        break
                    }

                    // 1.c. if next point is in a different frame we can move on to next iteration
                    if (frameUpper <= points[i + 1].x) {
                        i++
                        continue
                    }
                
                // 2. Point isn't on an exact frame
                // 2.a. There's a previous point, the we use it to interpolate the value.
                } else if (newPoints.length) {
                    newPoints.push({
                        x: frameLower,
                        y: G_points_interpolateLin(frameLower, points[i - 1], p),
                    })
                
                // 2.b. It's the very first point, then we don't change its value.
                } else {
                    newPoints.push({ x: frameLower, y: p.y })
                }

                // II. Placing interpolated point at the upper bound of the current frame
                // ---------------------------------------------------------------------------
                // First, we find the closest point from the frame upper bound (could be the same p).
                // Or could be a point that is exactly placed on frameUpper.
                while (
                    (i + 1) < points.length 
                    && (
                        Math.ceil(points[i + 1].x) === frameUpper
                        || Math.floor(points[i + 1].x) === frameUpper
                    )
                ) {
                    i++
                }
                p = points[i]

                // 1. If the next point is directly in the next frame, 
                // we do nothing, as this corresponds with next iteration frameLower.
                if (Math.floor(p.x) === frameUpper) {
                    continue
                
                // 2. If there's still a point after p, we use it to interpolate the value
                } else if (i < points.length - 1) {
                    newPoints.push({
                        x: frameUpper,
                        y: G_points_interpolateLin(frameUpper, p, points[i + 1]),
                    })

                // 3. If it's the last point, we dont change the value
                } else {
                    newPoints.push({ x: frameUpper, y: p.y })
                }

                i++
            }

            return newPoints
        }
function G_linesUtils_computeLineSegments(points) {
            const lineSegments = []
            let i = 0
            let p0
            let p1

            while(i < points.length - 1) {
                p0 = points[i]
                p1 = points[i + 1]
                lineSegments.push({
                    p0, p1, 
                    dy: G_linesUtils_computeSlope(p0, p1),
                    dx: 1,
                })
                i++
            }
            return lineSegments
        }
function G_msgUtils_slice(message, start, end) {
            if (G_msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = G_msgUtils__copyTemplate(message, start, end)
            const newMessage = G_msg_create(template)
            G_msgUtils_copy(message, newMessage, start, end, 0)
            return newMessage
        }
function G_msgUtils_concat(message1, message2) {
            const newMessage = G_msg_create(G_msgUtils__copyTemplate(message1, 0, G_msg_getLength(message1)).concat(G_msgUtils__copyTemplate(message2, 0, G_msg_getLength(message2))))
            G_msgUtils_copy(message1, newMessage, 0, G_msg_getLength(message1), 0)
            G_msgUtils_copy(message2, newMessage, 0, G_msg_getLength(message2), G_msg_getLength(message1))
            return newMessage
        }
function G_msgUtils_shift(message) {
            switch (G_msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return G_msg_create([])
                default:
                    return G_msgUtils_slice(message, 1, G_msg_getLength(message))
            }
        }
function G_msgUtils_copy(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (G_msg_getTokenType(src, i) === G_msg_STRING_TOKEN) {
                    G_msg_writeStringToken(dest, j, G_msg_readStringToken(src, i))
                } else {
                    G_msg_writeFloatToken(dest, j, G_msg_readFloatToken(src, i))
                }
            }
        }
function G_msgUtils__copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = G_msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === G_msg_STRING_TOKEN) {
                    template.push(G_msg_readStringToken(src, i).length)
                }
            }
            return template
        }
const G_fs_OPERATION_SUCCESS = 0
const G_fs_OPERATION_FAILURE = 1
const G_fs__OPERATIONS_IDS = new Set()
const G_fs__OPERATIONS_CALLBACKS = new Map()
const G_fs__OPERATIONS_SOUND_CALLBACKS = new Map()
let G_fs__OPERATIONS_COUNTER = 1

function G_fs_soundInfoToMessage(soundInfo) {
                const info = G_msg_create([
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_STRING_TOKEN,
                    soundInfo.encodingFormat.length,
                    G_msg_STRING_TOKEN,
                    soundInfo.endianness.length,
                    G_msg_STRING_TOKEN,
                    soundInfo.extraOptions.length
                ])
                G_msg_writeFloatToken(info, 0, toFloat(soundInfo.channelCount))
                G_msg_writeFloatToken(info, 1, toFloat(soundInfo.sampleRate))
                G_msg_writeFloatToken(info, 2, toFloat(soundInfo.bitDepth))
                G_msg_writeStringToken(info, 3, soundInfo.encodingFormat)
                G_msg_writeStringToken(info, 4, soundInfo.endianness)
                G_msg_writeStringToken(info, 5, soundInfo.extraOptions)
                return info
            }
function G_fs__assertOperationExists(id, operationName) {
                if (!G_fs__OPERATIONS_IDS.has(id)) {
                    throw new Error(operationName + ' operation unknown : ' + id.toString())
                }
            }
function G_fs__createOperationId() {
                const id = G_fs__OPERATIONS_COUNTER++
                G_fs__OPERATIONS_IDS.add(id)
                return id
            }
function G_soundFileOpenOpts_parse(m, soundInfo) {
            const unhandled = new Set()
            let i = 0
            while (i < G_msg_getLength(m)) {
                if (G_msg_isStringToken(m, i)) {
                    const str = G_msg_readStringToken(m, i)
                    if (['-wave', '-aiff', '-caf', '-next', '-ascii'].includes(str)) {
                        soundInfo.encodingFormat = str.slice(1)

                    } else if (str === '-raw') {
                        console.log('-raw format not yet supported')
                        i += 4
                        
                    } else if (str === '-big') {
                        soundInfo.endianness = 'b'

                    } else if (str === '-little') {
                        soundInfo.endianness = 'l'

                    } else if (str === '-bytes') {
                        if (i < G_msg_getLength(m) && G_msg_isFloatToken(m, i + 1)) {
                            soundInfo.bitDepth = toInt(G_msg_readFloatToken(m, i + 1) * 8)
                            i++
                        } else {
                            console.log('failed to parse -bytes <value>')
                        }

                    } else if (str === '-rate') {
                        if (i < G_msg_getLength(m) && G_msg_isFloatToken(m, i + 1)) {
                            soundInfo.sampleRate = toInt(G_msg_readFloatToken(m, i + 1))
                            i++
                        } else {
                            console.log('failed to parse -rate <value>')
                        }

                    } else {
                        unhandled.add(i)
                    }
                    
                } else {
                    unhandled.add(i)
                }
                i++
            }
            return unhandled
        }
function G_fs_readSoundFile(url, soundInfo, callback) {
            const id = G_fs__createOperationId()
            G_fs__OPERATIONS_SOUND_CALLBACKS.set(id, callback)
            G_fs_i_readSoundFile(id, url, G_fs_soundInfoToMessage(soundInfo))
            return id
        }
function G_fs_x_onReadSoundFileResponse(id, status, sound) {
            G_fs__assertOperationExists(id, "G_fs_x_onReadSoundFileResponse")
            G_fs__OPERATIONS_IDS.delete(id)
            // Finish cleaning before calling the callback in case it would throw an error.
            const callback = G_fs__OPERATIONS_SOUND_CALLBACKS.get(id)
            callback(id, status, sound)
            G_fs__OPERATIONS_SOUND_CALLBACKS.delete(id)
        }
function G_fs_writeSoundFile(sound, url, soundInfo, callback) {
            const id = G_fs__createOperationId()
            G_fs__OPERATIONS_CALLBACKS.set(id, callback)
            G_fs_i_writeSoundFile(id, sound, url, G_fs_soundInfoToMessage(soundInfo))
            return id
        }
function G_fs_x_onWriteSoundFileResponse(id, status) {
            G_fs__assertOperationExists(id, "G_fs_x_onWriteSoundFileResponse")
            G_fs__OPERATIONS_IDS.delete(id)
            // Finish cleaning before calling the callback in case it would throw an error.
            const callback = G_fs__OPERATIONS_CALLBACKS.get(id)
            callback(id, status)
            G_fs__OPERATIONS_CALLBACKS.delete(id)
        }

function G_buf_clear(buffer) {
            buffer.data.fill(0)
        }
function G_buf_create(length) {
            return {
                data: createFloatArray(length),
                length: length,
                writeCursor: 0,
                pullAvailableLength: 0,
            }
        }
const G_delayBuffers__BUFFERS = new Map()
const G_delayBuffers__SKEDULER = G_sked_create(true)
const G_delayBuffers_NULL_BUFFER = G_buf_create(1)
function G_delayBuffers_get(delayName) {
            G_delayBuffers__BUFFERS.get(delayName, buffer)
        }
function G_delayBuffers_set(delayName, buffer) {
            G_delayBuffers__BUFFERS.set(delayName, buffer)
            G_sked_emit(G_delayBuffers__SKEDULER, delayName)
        }
function G_delayBuffers_wait(delayName, callback) {
            G_sked_wait(G_delayBuffers__SKEDULER, delayName, callback)
        }
function G_delayBuffers_delete(delayName) {
            G_delayBuffers__BUFFERS.delete(delayName)
        }
function G_buf_writeSample(buffer, value) {
            buffer.data[buffer.writeCursor] = value
            buffer.writeCursor = (buffer.writeCursor + 1) % buffer.length
        }
function G_buf_readSample(buffer, offset) {
            // R = (buffer.writeCursor - 1 - offset) -> ideal read position
            // W = R % buffer.length -> wrap it so that its within buffer length bounds (but could be negative)
            // (W + buffer.length) % buffer.length -> if W negative, (W + buffer.length) shifts it back to positive.
            return buffer.data[(buffer.length + ((buffer.writeCursor - 1 - offset) % buffer.length)) % buffer.length]
        }
        




function NT_hsl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_hsl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_hsl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_hsl_defaultMessageHandler(m) {}
function NT_hsl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_hsl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }





function NT_bang_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_bang_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_bang_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_bang_defaultMessageHandler(m) {}
function NT_bang_receiveMessage(state, m) {
                if (NT_bang_setSendReceiveFromMessage(state, m) === true) {
                    return
                }
                
                const outMessage = G_bangUtils_bang()
                state.messageSender(outMessage)
                if (state.sendBusName !== "empty") {
                    G_msgBuses_publish(state.sendBusName, outMessage)
                }
                return
            }

function NT_random_setMaxValue(state, maxValue) {
                state.maxValue = Math.max(maxValue, 0)
            }

function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }







const NT_line_t_defaultLine = {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            }
function NT_line_t_setNewLine(state, targetValue) {
                const startFrame = toFloat(FRAME)
                const endFrame = toFloat(FRAME) + state.nextDurationSamp
                if (endFrame === toFloat(FRAME)) {
                    state.currentLine = NT_line_t_defaultLine
                    state.currentValue = targetValue
                    state.nextDurationSamp = 0
                } else {
                    state.currentLine = {
                        p0: {
                            x: startFrame, 
                            y: state.currentValue,
                        }, 
                        p1: {
                            x: endFrame, 
                            y: targetValue,
                        }, 
                        dx: 1,
                        dy: 0,
                    }
                    state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1)
                    state.nextDurationSamp = 0
                }
            }
function NT_line_t_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_t_stop(state) {
                state.currentLine.p1.x = -1
                state.currentLine.p1.y = state.currentValue
            }



function NT_delay_setDelay(state, delay) {
                state.delay = Math.max(0, delay)
            }
function NT_delay_scheduleDelay(state, callback, currentFrame) {
                if (state.scheduledBang !== G_sked_ID_NULL) {
                    NT_delay_stop(state)
                }
                state.scheduledBang = G_commons_waitFrame(toInt(
                    Math.round(
                        toFloat(currentFrame) + state.delay * state.sampleRatio)),
                    callback
                )
            }
function NT_delay_stop(state) {
                G_commons_cancelWaitFrame(state.scheduledBang)
                state.scheduledBang = G_sked_ID_NULL
            }

function NT_float_setValue(state, value) {
                state.value = value
            }

function NT_div_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_div_setRight(state, value) {
                    state.rightOp = value
                }

function NT_metro_setRate(state, rate) {
                state.rate = Math.max(rate, 0)
            }
function NT_metro_scheduleNextTick(state) {
                state.snd0(G_bangUtils_bang())
                state.realNextTick = state.realNextTick + state.rate * state.sampleRatio
                state.skedId = G_commons_waitFrame(
                    toInt(Math.round(state.realNextTick)), 
                    state.tickCallback,
                )
            }
function NT_metro_stop(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                state.realNextTick = 0
            }

function NT_mod_setLeft(state, value) {
                    state.leftOp = value > 0 ? Math.floor(value): Math.ceil(value)
                }
function NT_mod_setRight(state, value) {
                    state.rightOp = Math.floor(Math.abs(value))
                }

function NT_floatatom_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_floatatom_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_floatatom_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_floatatom_defaultMessageHandler(m) {}
function NT_floatatom_receiveMessage(state, m) {
                    if (G_bangUtils_isBang(m)) {
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
                    
                    } else if (
                        G_msg_getTokenType(m, 0) === G_msg_STRING_TOKEN
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        const setMessage = G_msgUtils_slice(m, 1, G_msg_getLength(m))
                        if (G_msg_isMatching(setMessage, [G_msg_FLOAT_TOKEN])) { 
                                state.value = setMessage    
                                return
                        }
        
                    } else if (NT_floatatom_setSendReceiveFromMessage(state, m) === true) {
                        return
                        
                    } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                    
                        state.value = m
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
        
                    }
                }



function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
                }

function NT_eq_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_eq_setRight(state, value) {
                    state.rightOp = value
                }

function NT_line_setNewLine(state, targetValue) {
                state.currentLine = {
                    p0: {
                        x: toFloat(FRAME), 
                        y: state.currentValue,
                    }, 
                    p1: {
                        x: toFloat(FRAME) + state.nextDurationSamp, 
                        y: targetValue,
                    }, 
                    dx: state.grainSamp
                }
                state.nextDurationSamp = 0
                state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1) * state.grainSamp
            }
function NT_line_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_setGrain(state, grainMsec) {
                state.grainSamp = computeUnitInSamples(SAMPLE_RATE, Math.max(grainMsec, 20), 'msec')
            }
function NT_line_stopCurrentLine(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                if (FRAME < state.nextSampInt) {
                    NT_line_incrementTime(state, -1 * (state.nextSamp - toFloat(FRAME)))
                }
                NT_line_setNextSamp(state, -1)
            }
function NT_line_setNextSamp(state, currentSamp) {
                state.nextSamp = currentSamp
                state.nextSampInt = toInt(Math.round(currentSamp))
            }
function NT_line_incrementTime(state, incrementSamp) {
                if (incrementSamp === state.currentLine.dx) {
                    state.currentValue += state.currentLine.dy
                } else {
                    state.currentValue += G_points_interpolateLin(
                        incrementSamp,
                        {x: 0, y: 0},
                        {x: state.currentLine.dx, y: state.currentLine.dy},
                    )
                }
                NT_line_setNextSamp(
                    state, 
                    (state.nextSamp !== -1 ? state.nextSamp: toFloat(FRAME)) + incrementSamp
                )
            }
function NT_line_tick(state) {
                state.snd0(G_msg_floats([state.currentValue]))
                if (toFloat(FRAME) >= state.currentLine.p1.x) {
                    state.currentValue = state.currentLine.p1.y
                    NT_line_stopCurrentLine(state)
                } else {
                    NT_line_incrementTime(state, state.currentLine.dx)
                    NT_line_scheduleNextTick(state)
                }
            }
function NT_line_scheduleNextTick(state) {
                state.skedId = G_commons_waitFrame(state.nextSampInt, state.tickCallback)
            }

function NT_sub_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_sub_setRight(state, value) {
                    state.rightOp = value
                }

const NT_tabplay_t_emptyArray = createFloatArray(1)
function NT_tabplay_t_createState(arrayName) {
            return {
                array: NT_tabplay_t_emptyArray,
                arrayName,
                arrayChangesSubscription: G_sked_ID_NULL,
                readPosition: 0,
                readUntil: 0,
                writePosition: 0,
            }
        }
function NT_tabplay_t_setArrayName(state, arrayName, callback) {
            if (state.arrayChangesSubscription != G_sked_ID_NULL) {
                G_commons_cancelArrayChangesSubscription(state.arrayChangesSubscription)
            }
            state.arrayName = arrayName
            state.array = NT_tabplay_t_emptyArray
            G_commons_subscribeArrayChanges(arrayName, callback)
        }
function NT_tabplay_t_prepareIndex(index, arrayLength) {
            return toInt(Math.min(
                Math.max(
                    0, Math.floor(index)
                ), toFloat(arrayLength - 1)
            ))
        }
function NT_tabplay_t_setArrayNameFinalize(state) {
                state.array = G_commons_getArray(state.arrayName)
                state.readPosition = state.array.length
                state.readUntil = state.array.length
            }
function NT_tabplay_t_play(state, playFrom, playTo) {
                state.readPosition = playFrom
                state.readUntil = toInt(Math.min(
                    toFloat(playTo), 
                    toFloat(state.array.length),
                ))
            }
function NT_tabplay_t_stop(state) {
                state.readPosition = 0
                state.readUntil = 0
            }






function NT_soundfiler_buildMessage1(soundInfo) {
                const m = G_msg_create([
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_FLOAT_TOKEN,
                    G_msg_STRING_TOKEN,
                    soundInfo.endianness.length,
                ])
                G_msg_writeFloatToken(m, 0, toFloat(soundInfo.sampleRate))
                G_msg_writeFloatToken(m, 1, -1) // TODO IMPLEMENT headersize
                G_msg_writeFloatToken(m, 2, toFloat(soundInfo.channelCount))
                G_msg_writeFloatToken(m, 3, Math.round(toFloat(soundInfo.bitDepth) / 8))
                G_msg_writeStringToken(m, 4, soundInfo.endianness)
                return m
            }



function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }





function NT_delread_t_setDelayName(state, delayName, callback) {
                if (state.delayName.length) {
                    state.buffer = G_delayBuffers_NULL_BUFFER
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_wait(state.delayName, callback)
                }
            }
function NT_delread_t_setRawOffset(state, rawOffset) {
                state.rawOffset = rawOffset
                NT_delread_t_updateOffset(state)
            }
function NT_delread_t_updateOffset(state) {
                state.offset = toInt(Math.round(
                    Math.min(
                        Math.max(computeUnitInSamples(SAMPLE_RATE, state.rawOffset, "msec"), 0), 
                        toFloat(state.buffer.length - 1)
                    )
                ))
            }
function NT_delread_t_NOOP(_) {}



function NT_delwrite_t_setDelayName(state, delayName) {
                if (state.delayName.length) {
                    G_delayBuffers_delete(state.delayName)
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_set(state.delayName, state.buffer)
                }
            }

function NT_lop_t_setFreq(state, freq) {
                state.coeff = Math.max(Math.min(freq * 2 * Math.PI / SAMPLE_RATE, 1), 0)
            }



function NT_filters_bp_t_updateCoefs(state) {
                let omega = state.frequency * (2.0 * Math.PI) / SAMPLE_RATE
                let oneminusr = state.Q < 0.001 ? 1.0 : Math.min(omega / state.Q, 1)
                let r = 1.0 - oneminusr
                let sigbp_qcos = (omega >= -(0.5 * Math.PI) && omega <= 0.5 * Math.PI) ? 
                    (((Math.pow(omega, 6) * (-1.0 / 720.0) + Math.pow(omega, 4) * (1.0 / 24)) - Math.pow(omega, 2) * 0.5) + 1)
                    : 0
        
                state.coef1 = 2.0 * sigbp_qcos * r
                state.coef2 = - r * r
                state.gain = 2 * oneminusr * (oneminusr + r * omega)
            }
function NT_filters_bp_t_setFrequency(state, frequency) {
                state.frequency = (frequency < 0.001) ? 10: frequency
                NT_filters_bp_t_updateCoefs(state)
            }
function NT_filters_bp_t_setQ(state, Q) {
                state.Q = Math.max(Q, 0)
                NT_filters_bp_t_updateCoefs(state)
            }
function NT_filters_bp_t_clear(state) {
                state.ym1 = 0
                state.ym2 = 0
            }







        const N_n_0_6_state = {
                                msgSpecs: [],
                            }
const N_n_0_7_state = {
                                minValue: 70,
maxValue: 130,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "Tempo-BPM",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_0_33_state = {
                                currentValue: 0,
                            }
const N_n_0_35_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_36_state = {
                                maxValue: 12,
                            }
const N_n_0_37_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_39_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_41_state = {
                                msgSpecs: [],
                            }
const N_n_0_40_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_43_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_42_state = {
                                msgSpecs: [],
                            }
const N_n_9_3_state = {
                                value: 0,
                            }
const N_n_0_10_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_12_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_13_state = {
                                value: 0,
                            }
const N_n_0_14_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_15_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_17_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_0_16_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_49_state = {
                                floatFilter: 2,
stringFilter: "2",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_50_state = {
                                msgSpecs: [],
                            }
const N_n_0_58_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_60_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_62_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_61_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_65_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_67_state = {
                                msgSpecs: [],
                            }
const N_n_0_66_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_69_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_68_state = {
                                msgSpecs: [],
                            }
const N_n_0_77_state = {
                                value: 0,
                            }
const N_n_0_78_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_79_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_80_state = {
                                msgSpecs: [],
                            }
const N_n_0_82_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_85_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_10_3_state = {
                                value: 0,
                            }
const N_n_0_84_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_86_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_81_state = {
                                msgSpecs: [],
                            }
const N_n_0_52_state = {
                                msgSpecs: [],
                            }
const N_n_0_54_state = {
                                msgSpecs: [],
                            }
const N_n_0_53_state = {
                                msgSpecs: [],
                            }
const N_n_0_51_state = {
                                msgSpecs: [],
                            }
const N_n_0_55_state = {
                                msgSpecs: [],
                            }
const N_n_0_56_state = {
                                msgSpecs: [],
                            }
const N_n_0_57_state = {
                                msgSpecs: [],
                            }
const N_n_0_88_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_89_state = {
                                msgSpecs: [],
                            }
const N_n_0_93_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_95_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_96_state = {
                                msgSpecs: [],
                            }
const N_n_0_100_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_102_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_103_state = {
                                msgSpecs: [],
                            }
const N_n_0_107_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_109_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_112_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_115_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_114_state = {
                                msgSpecs: [],
                            }
const N_n_0_113_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_117_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_116_state = {
                                msgSpecs: [],
                            }
const N_n_0_90_state = {
                                msgSpecs: [],
                            }
const N_n_0_97_state = {
                                msgSpecs: [],
                            }
const N_n_0_104_state = {
                                msgSpecs: [],
                            }
const N_n_0_91_state = {
                                msgSpecs: [],
                            }
const N_n_0_98_state = {
                                msgSpecs: [],
                            }
const N_n_0_105_state = {
                                msgSpecs: [],
                            }
const N_n_0_92_state = {
                                msgSpecs: [],
                            }
const N_n_0_99_state = {
                                msgSpecs: [],
                            }
const N_n_0_106_state = {
                                msgSpecs: [],
                            }
const N_n_0_124_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_125_state = {
                                msgSpecs: [],
                            }
const N_n_0_128_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_130_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_132_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_134_state = {
                                msgSpecs: [],
                            }
const N_n_0_133_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_136_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_135_state = {
                                msgSpecs: [],
                            }
const N_n_0_126_state = {
                                msgSpecs: [],
                            }
const N_n_0_127_state = {
                                msgSpecs: [],
                            }
const N_n_0_248_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_249_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_251_state = {
                                msgSpecs: [],
                            }
const N_n_0_250_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_253_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_252_state = {
                                msgSpecs: [],
                            }
const N_n_0_257_state = {
                                floatFilter: 4,
stringFilter: "4",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_258_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_260_state = {
                                msgSpecs: [],
                            }
const N_n_0_259_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_262_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_261_state = {
                                msgSpecs: [],
                            }
const N_n_0_267_state = {
                                floatFilter: 2,
stringFilter: "2",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_268_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_270_state = {
                                msgSpecs: [],
                            }
const N_n_0_269_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_272_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_271_state = {
                                msgSpecs: [],
                            }
const N_n_0_289_state = {
                                floatFilter: 10,
stringFilter: "10",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_293_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_297_state = {
                                array: NT_tabplay_t_emptyArray,
arrayName: "sample_bloop",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_n_0_290_state = {
                                floatFilter: 4,
stringFilter: "4",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_294_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_298_state = {
                                array: NT_tabplay_t_emptyArray,
arrayName: "sample_water",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_n_0_291_state = {
                                floatFilter: 12,
stringFilter: "12",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_295_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_299_state = {
                                array: NT_tabplay_t_emptyArray,
arrayName: "sample_pop",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_n_0_292_state = {
                                floatFilter: 15,
stringFilter: "15",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_296_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_300_state = {
                                array: NT_tabplay_t_emptyArray,
arrayName: "sample_chirp",
arrayChangesSubscription: G_sked_ID_NULL,
readPosition: 0,
readUntil: 0,
writePosition: 0,
                            }
const N_n_0_205_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_206_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_207_state = {
                                value: 0,
                            }
const N_n_0_208_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_209_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_210_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_211_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_212_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_213_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_214_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_225_state = {
                                msgSpecs: [],
                            }
const N_n_0_226_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_228_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_229_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_230_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_233_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_235_state = {
                                msgSpecs: [],
                            }
const N_n_0_234_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_237_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_236_state = {
                                msgSpecs: [],
                            }
const N_n_0_224_state = {
                                msgSpecs: [],
                            }
const N_n_0_223_state = {
                                msgSpecs: [],
                            }
const N_n_0_222_state = {
                                msgSpecs: [],
                            }
const N_n_0_221_state = {
                                msgSpecs: [],
                            }
const N_n_0_220_state = {
                                msgSpecs: [],
                            }
const N_n_0_240_state = {
                                msgSpecs: [],
                            }
const N_n_0_242_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_245_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_13_3_state = {
                                value: 0,
                            }
const N_n_0_244_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_246_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_215_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_216_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_217_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_218_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_219_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_241_state = {
                                msgSpecs: [],
                            }
const N_n_0_11_state = {
                                msgSpecs: [],
                            }
const N_n_0_144_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_145_state = {
                                maxValue: 320,
                            }
const N_n_0_146_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_147_state = {
                                msgSpecs: [],
                            }
const N_n_0_148_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_143_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_153_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_154_state = {
                                maxValue: 15,
                            }
const N_n_0_155_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_156_state = {
                                maxValue: 700,
                            }
const N_n_0_157_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_160_state = {
                                floatValues: [0,0],
stringValues: ["",""],
                            }
const N_n_0_161_state = {
                                msgSpecs: [],
                            }
const N_n_0_162_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_163_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_159_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_165_state = {
                                msgSpecs: [],
                            }
const N_n_0_164_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_167_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_166_state = {
                                msgSpecs: [],
                            }
const N_n_0_171_state = {
                                maxValue: 100,
                            }
const N_n_0_172_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_173_state = {
                                msgSpecs: [],
                            }
const N_n_0_174_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_177_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_11_3_state = {
                                value: 0,
                            }
const N_n_0_176_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_178_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_179_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_180_state = {
                                maxValue: 3,
                            }
const N_n_0_181_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_182_state = {
                                maxValue: 400,
                            }
const N_n_0_183_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_186_state = {
                                floatValues: [0,0],
stringValues: ["",""],
                            }
const N_n_0_187_state = {
                                msgSpecs: [],
                            }
const N_n_0_188_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_189_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_185_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_191_state = {
                                msgSpecs: [],
                            }
const N_n_0_190_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_193_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_192_state = {
                                msgSpecs: [],
                            }
const N_n_0_197_state = {
                                maxValue: 100,
                            }
const N_n_0_198_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_199_state = {
                                msgSpecs: [],
                            }
const N_n_0_200_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_m_n_0_203_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_12_3_state = {
                                value: 0,
                            }
const N_n_0_202_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_204_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_19_state = {
                                msgSpecs: [],
                            }
const N_n_0_20_state = {
                                minValue: -12,
maxValue: 12,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "Transpose-Key",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_n_0_31_state = {
                                currentValue: 0,
                            }
const N_n_0_22_state = {
                                msgSpecs: [],
                            }
const N_n_0_23_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "SFX-Volume",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_m_n_0_149_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_169_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_195_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_315_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_316_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_25_state = {
                                msgSpecs: [],
                            }
const N_n_0_26_state = {
                                minValue: 0,
maxValue: 0.9,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "Delay-Feedback",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_m_n_0_73_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_28_state = {
                                msgSpecs: [],
                            }
const N_n_0_29_state = {
                                minValue: 0,
maxValue: 0.5,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "Master-Gain",
sendBusName: "empty",
messageReceiver: NT_hsl_defaultMessageHandler,
messageSender: NT_hsl_defaultMessageHandler,
                            }
const N_m_n_0_344_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_345_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_283_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_0_284_state = {
                                msgSpecs: [],
                            }
const N_n_0_288_state = {
                                operations: new Map(),
                            }
const N_n_0_285_state = {
                                msgSpecs: [],
                            }
const N_n_0_286_state = {
                                msgSpecs: [],
                            }
const N_n_0_287_state = {
                                msgSpecs: [],
                            }
const N_n_0_60_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_61_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_63_1_sig_state = {
                                currentValue: 0.22,
                            }
const N_m_n_0_72_0_sig_state = {
                                currentValue: 333,
                            }
const N_n_0_72_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_0_228_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_230_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_231_1_sig_state = {
                                currentValue: 0.15,
                            }
const N_m_n_0_239_1_sig_state = {
                                currentValue: 0.16,
                            }
const N_n_0_71_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_m_n_0_74_1_sig_state = {
                                currentValue: 0.42,
                            }
const N_m_n_0_76_1_sig_state = {
                                currentValue: 0.16,
                            }
const N_n_0_95_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_102_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_109_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_119_1_sig_state = {
                                currentValue: 400,
                            }
const N_n_0_119_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_0_120_1_sig_state = {
                                currentValue: 0.32,
                            }
const N_m_n_0_121_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_n_0_143_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_0_150_1_sig_state = {
                                currentValue: 0.08,
                            }
const N_m_n_0_151_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_n_0_163_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_170_1_sig_state = {
                                currentValue: 0.2,
                            }
const N_m_n_0_254_0_sig_state = {
                                currentValue: 48,
                            }
const N_n_0_254_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_256_1_sig_state = {
                                currentValue: 0.45,
                            }
const N_n_0_264_state = {
                                frequency: 2500,
Q: 12,
coef1: 0,
coef2: 0,
gain: 0,
y: 0,
ym1: 0,
ym2: 0,
                            }
const N_m_n_0_266_1_sig_state = {
                                currentValue: 0.35,
                            }
const N_m_n_0_274_1_sig_state = {
                                currentValue: 8000,
                            }
const N_n_0_274_state = {
                                previous: 0,
current: 0,
coeff: 0,
normal: 0,
                            }
const N_m_n_0_276_1_sig_state = {
                                currentValue: 0.15,
                            }
const N_n_0_189_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_196_1_sig_state = {
                                currentValue: 0.22,
                            }
const N_n_0_130_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_131_1_sig_state = {
                                currentValue: 180,
                            }
const N_n_0_131_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_0_138_1_sig_state = {
                                currentValue: 0.35,
                            }
const N_m_n_0_139_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_n_0_39_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_0_45_1_sig_state = {
                                currentValue: 0.08,
                            }
const N_m_n_0_46_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_301_1_sig_state = {
                                currentValue: 0.7,
                            }
const N_m_n_0_303_1_sig_state = {
                                currentValue: 0.3,
                            }
const N_m_n_0_305_1_sig_state = {
                                currentValue: 0.6,
                            }
const N_m_n_0_307_1_sig_state = {
                                currentValue: 0.4,
                            }
const N_m_n_0_317_1_sig_state = {
                                currentValue: 0.35,
                            }
const N_n_0_342_state = {
                                minValue: -0.9,
maxValue: 0.9,
                            }
const N_m_n_0_122_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_152_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_140_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_47_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_302_1_sig_state = {
                                currentValue: 0.3,
                            }
const N_m_n_0_304_1_sig_state = {
                                currentValue: 0.7,
                            }
const N_m_n_0_306_1_sig_state = {
                                currentValue: 0.4,
                            }
const N_m_n_0_308_1_sig_state = {
                                currentValue: 0.6,
                            }
const N_m_n_0_318_1_sig_state = {
                                currentValue: 0.35,
                            }
const N_n_0_343_state = {
                                minValue: -0.9,
maxValue: 0.9,
                            }
        


function N_n_0_6_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_6_state.msgSpecs.splice(0, N_n_0_6_state.msgSpecs.length - 1)
                    N_n_0_6_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_6_state.msgSpecs.length; i++) {
                        if (N_n_0_6_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_6_state.msgSpecs[i].send, N_n_0_6_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_6_snds_0(N_n_0_6_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_7_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_7_state, m)
                return
            
                            throw new Error('Node "n_0_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_33_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                const newValue = G_msg_readFloatToken(m, 0)
                if (newValue !== N_n_0_33_state.currentValue) {
                    N_n_0_33_state.currentValue = newValue
                    N_n_0_34_rcvs_0(G_msg_floats([N_n_0_33_state.currentValue]))
                }
                return
    
            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_0(G_msg_floats([N_n_0_33_state.currentValue]))
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                N_n_0_33_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_34_rcvs_0(m) {
                            
            N_n_0_35_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_34", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_35_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_35_state, m)
            return
        
                            throw new Error('Node "n_0_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_36_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_37_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_36_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_37_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_37_state, G_msg_readFloatToken(m, 0))
                        N_n_0_38_rcvs_0(G_msg_floats([N_n_0_37_state.leftOp + N_n_0_37_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_38_rcvs_0(G_msg_floats([N_n_0_37_state.leftOp + N_n_0_37_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_38_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_0_39_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_38", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_39_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_39_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_39_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_39_0_sig_outs_0 = 0
function N_m_n_0_39_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_39_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_39_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_41_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_41_state.msgSpecs.splice(0, N_n_0_41_state.msgSpecs.length - 1)
                    N_n_0_41_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_41_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_41_state.msgSpecs.length; i++) {
                        if (N_n_0_41_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_41_state.msgSpecs[i].send, N_n_0_41_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_41_snds_0(N_n_0_41_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_41", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_40_outs_0 = 0
function N_n_0_40_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_40_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_40_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_40_state)
                return
    
            }
        
                            throw new Error('Node "n_0_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_41_0_rcvs_0(m) {
                            
                IO_snd_n_0_41_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_41_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_43_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_43_state, 
                            () => N_n_0_42_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_43_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_43_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_43_state,
                        () => N_n_0_42_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_43_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_43", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_42_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_42_state.msgSpecs.splice(0, N_n_0_42_state.msgSpecs.length - 1)
                    N_n_0_42_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_42_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_42_state.msgSpecs.length; i++) {
                        if (N_n_0_42_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_42_state.msgSpecs[i].send, N_n_0_42_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_42_snds_0(N_n_0_42_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_42", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_42_0_rcvs_0(m) {
                            
                IO_snd_n_0_42_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_42_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_2_rcvs_0(m) {
                            
            N_n_0_10_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_9_3_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_9_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_9_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_10_rcvs_0(G_msg_floats([N_n_9_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_10_rcvs_0(G_msg_floats([N_n_9_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_9_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_0_10_state, G_msg_readFloatToken(m, 0))
                        N_n_0_12_rcvs_1(G_msg_floats([N_n_0_10_state.rightOp !== 0 ? N_n_0_10_state.leftOp / N_n_0_10_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_12_rcvs_1(G_msg_floats([N_n_0_10_state.rightOp !== 0 ? N_n_0_10_state.leftOp / N_n_0_10_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_10_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_div_setRight(N_n_0_10_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_10", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_12_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_12_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_12_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_12_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_metro_setRate(N_n_0_12_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_12", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_0_13_state, G_msg_readFloatToken(m, 0))
                N_n_0_14_rcvs_0(G_msg_floats([N_n_0_13_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_14_rcvs_0(G_msg_floats([N_n_0_13_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_13_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_float_setValue(N_n_0_13_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_13", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_14_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_14_state, G_msg_readFloatToken(m, 0))
                        N_n_0_14_snds_0(G_msg_floats([N_n_0_14_state.leftOp + N_n_0_14_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_14_snds_0(G_msg_floats([N_n_0_14_state.leftOp + N_n_0_14_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_15_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mod_setLeft(N_n_0_15_state, G_msg_readFloatToken(m, 0))
                        N_n_0_17_rcvs_0(G_msg_floats([N_n_0_15_state.rightOp !== 0 ? (N_n_0_15_state.rightOp + (N_n_0_15_state.leftOp % N_n_0_15_state.rightOp)) % N_n_0_15_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_17_rcvs_0(G_msg_floats([N_n_0_15_state.rightOp !== 0 ? (N_n_0_15_state.rightOp + (N_n_0_15_state.leftOp % N_n_0_15_state.rightOp)) % N_n_0_15_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_17_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_0_17_state, m)
                return
            
                            throw new Error('Node "n_0_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_17_0_rcvs_0(m) {
                            
                IO_snd_n_0_17_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_17_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_16_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mod_setLeft(N_n_0_16_state, G_msg_readFloatToken(m, 0))
                        N_n_0_16_snds_0(G_msg_floats([N_n_0_16_state.rightOp !== 0 ? (N_n_0_16_state.rightOp + (N_n_0_16_state.leftOp % N_n_0_16_state.rightOp)) % N_n_0_16_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_16_snds_0(G_msg_floats([N_n_0_16_state.rightOp !== 0 ? (N_n_0_16_state.rightOp + (N_n_0_16_state.leftOp % N_n_0_16_state.rightOp)) % N_n_0_16_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_49_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_49_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_49_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_0_49_snds_2(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 10
                            ) {
                                N_n_0_49_snds_3(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 12
                            ) {
                                N_n_0_49_snds_4(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 14
                            ) {
                                N_n_0_49_snds_5(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 18
                            ) {
                                N_n_0_49_snds_6(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 20
                            ) {
                                N_n_0_49_snds_7(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 22
                            ) {
                                N_n_0_49_snds_8(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 26
                            ) {
                                N_n_0_49_snds_9(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 28
                            ) {
                                N_n_0_49_snds_10(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 30
                            ) {
                                N_n_0_49_snds_11(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 34
                            ) {
                                N_n_0_49_snds_12(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 36
                            ) {
                                N_n_0_49_snds_13(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 38
                            ) {
                                N_n_0_49_snds_14(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 42
                            ) {
                                N_n_0_49_snds_15(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 44
                            ) {
                                N_n_0_49_snds_16(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 46
                            ) {
                                N_n_0_49_snds_17(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 50
                            ) {
                                N_n_0_49_snds_18(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 52
                            ) {
                                N_n_0_49_snds_19(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 54
                            ) {
                                N_n_0_49_snds_20(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 58
                            ) {
                                N_n_0_49_snds_21(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 60
                            ) {
                                N_n_0_49_snds_22(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 62
                            ) {
                                N_n_0_49_snds_23(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_49", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_50_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_50_state.msgSpecs.splice(0, N_n_0_50_state.msgSpecs.length - 1)
                    N_n_0_50_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_50_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_50_state.msgSpecs.length; i++) {
                        if (N_n_0_50_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_50_state.msgSpecs[i].send, N_n_0_50_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_50_snds_0(N_n_0_50_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_50", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_58_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_58_state, G_msg_readFloatToken(m, 0))
                        N_n_0_59_rcvs_0(G_msg_floats([N_n_0_58_state.leftOp + N_n_0_58_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_59_rcvs_0(G_msg_floats([N_n_0_58_state.leftOp + N_n_0_58_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_58", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_58_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_58_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_58", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_59_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_0_59_snds_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_59", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_60_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_60_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_60_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_60_0_sig_outs_0 = 0
function N_m_n_0_60_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_60_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_60_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_62_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_62_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_61_0__routemsg_rcvs_0(G_msg_floats([N_n_0_62_state.leftOp * N_n_0_62_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_61_0__routemsg_rcvs_0(G_msg_floats([N_n_0_62_state.leftOp * N_n_0_62_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_62", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_61_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_61_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_61_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_61_0_sig_outs_0 = 0
function N_m_n_0_61_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_61_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_61_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_50_0_rcvs_0(m) {
                            
                IO_snd_n_0_50_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_50_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_65_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_65_state, m)
            return
        
                            throw new Error('Node "n_0_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_67_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_67_state.msgSpecs.splice(0, N_n_0_67_state.msgSpecs.length - 1)
                    N_n_0_67_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_67_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_67_state.msgSpecs.length; i++) {
                        if (N_n_0_67_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_67_state.msgSpecs[i].send, N_n_0_67_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_67_snds_0(N_n_0_67_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_67", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_66_outs_0 = 0
function N_n_0_66_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_66_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_66_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_66_state)
                return
    
            }
        
                            throw new Error('Node "n_0_66", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_67_0_rcvs_0(m) {
                            
                IO_snd_n_0_67_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_67_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_69_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_69_state, 
                            () => N_n_0_68_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_69_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_69_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_69_state,
                        () => N_n_0_68_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_69_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_69", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_68_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_68_state.msgSpecs.splice(0, N_n_0_68_state.msgSpecs.length - 1)
                    N_n_0_68_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_68_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_68_state.msgSpecs.length; i++) {
                        if (N_n_0_68_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_68_state.msgSpecs[i].send, N_n_0_68_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_68_snds_0(N_n_0_68_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_68", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_68_0_rcvs_0(m) {
                            
                IO_snd_n_0_68_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_68_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_77_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_0_77_state, G_msg_readFloatToken(m, 0))
                N_n_0_77_snds_0(G_msg_floats([N_n_0_77_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_77_snds_0(G_msg_floats([N_n_0_77_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_77", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_77_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_float_setValue(N_n_0_77_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_77", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_78_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_eq_setLeft(N_n_0_78_state, G_msg_readFloatToken(m, 0))
                        N_n_0_77_rcvs_1(G_msg_floats([N_n_0_78_state.leftOp == N_n_0_78_state.rightOp ? 1: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_77_rcvs_1(G_msg_floats([N_n_0_78_state.leftOp == N_n_0_78_state.rightOp ? 1: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_78", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_79_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_80_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_81_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_79", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_80_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_80_state.msgSpecs.splice(0, N_n_0_80_state.msgSpecs.length - 1)
                    N_n_0_80_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_80_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_80_state.msgSpecs.length; i++) {
                        if (N_n_0_80_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_80_state.msgSpecs[i].send, N_n_0_80_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_80_snds_0(N_n_0_80_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_80", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_82_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_82_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_82_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_82_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_82_state.nextDurationSamp === 0) {
                            N_n_0_82_state.currentValue = targetValue
                            N_n_0_82_snds_0(G_msg_floats([targetValue]))
                        } else {
                            N_n_0_82_snds_0(G_msg_floats([N_n_0_82_state.currentValue]))
                            NT_line_setNewLine(N_n_0_82_state, targetValue)
                            NT_line_incrementTime(N_n_0_82_state, N_n_0_82_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_82_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_82_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_82_state)
                N_n_0_82_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_82", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_85_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_85_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_85_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_85_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_85_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_85_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_2_rcvs_0(m) {
                            
            N_n_0_84_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_10_3_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_10_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_10_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_84_rcvs_0(G_msg_floats([N_n_10_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_84_rcvs_0(G_msg_floats([N_n_10_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_10_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_84_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_84_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_86_1__routemsg_rcvs_0(G_msg_floats([N_n_0_84_state.leftOp - N_n_0_84_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_86_1__routemsg_rcvs_0(G_msg_floats([N_n_0_84_state.leftOp - N_n_0_84_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_84", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_84_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_sub_setRight(N_n_0_84_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_84", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_86_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_86_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_86_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_86_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_86_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_86_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_80_0_rcvs_0(m) {
                            
                IO_snd_n_0_80_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_80_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_81_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_81_state.msgSpecs.splice(0, N_n_0_81_state.msgSpecs.length - 1)
                    N_n_0_81_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_81_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_81_state.msgSpecs.length; i++) {
                        if (N_n_0_81_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_81_state.msgSpecs[i].send, N_n_0_81_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_81_snds_0(N_n_0_81_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_81", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_81_0_rcvs_0(m) {
                            
                IO_snd_n_0_81_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_81_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_52_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_52_state.msgSpecs.splice(0, N_n_0_52_state.msgSpecs.length - 1)
                    N_n_0_52_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_52_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_52_state.msgSpecs.length; i++) {
                        if (N_n_0_52_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_52_state.msgSpecs[i].send, N_n_0_52_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_52_snds_0(N_n_0_52_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_52", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_52_0_rcvs_0(m) {
                            
                IO_snd_n_0_52_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_52_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_54_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_54_state.msgSpecs.splice(0, N_n_0_54_state.msgSpecs.length - 1)
                    N_n_0_54_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_54_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_54_state.msgSpecs.length; i++) {
                        if (N_n_0_54_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_54_state.msgSpecs[i].send, N_n_0_54_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_54_snds_0(N_n_0_54_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_54", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_54_0_rcvs_0(m) {
                            
                IO_snd_n_0_54_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_54_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_53_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_53_state.msgSpecs.splice(0, N_n_0_53_state.msgSpecs.length - 1)
                    N_n_0_53_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_53_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_53_state.msgSpecs.length; i++) {
                        if (N_n_0_53_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_53_state.msgSpecs[i].send, N_n_0_53_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_53_snds_0(N_n_0_53_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_53", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_53_0_rcvs_0(m) {
                            
                IO_snd_n_0_53_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_53_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_51_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_51_state.msgSpecs.splice(0, N_n_0_51_state.msgSpecs.length - 1)
                    N_n_0_51_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_51_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_51_state.msgSpecs.length; i++) {
                        if (N_n_0_51_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_51_state.msgSpecs[i].send, N_n_0_51_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_51_snds_0(N_n_0_51_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_51", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_51_0_rcvs_0(m) {
                            
                IO_snd_n_0_51_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_51_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_55_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_55_state.msgSpecs.splice(0, N_n_0_55_state.msgSpecs.length - 1)
                    N_n_0_55_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_55_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_55_state.msgSpecs.length; i++) {
                        if (N_n_0_55_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_55_state.msgSpecs[i].send, N_n_0_55_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_55_snds_0(N_n_0_55_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_55", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_55_0_rcvs_0(m) {
                            
                IO_snd_n_0_55_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_55_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_56_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_56_state.msgSpecs.splice(0, N_n_0_56_state.msgSpecs.length - 1)
                    N_n_0_56_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_56_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_56_state.msgSpecs.length; i++) {
                        if (N_n_0_56_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_56_state.msgSpecs[i].send, N_n_0_56_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_56_snds_0(N_n_0_56_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_56", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_56_0_rcvs_0(m) {
                            
                IO_snd_n_0_56_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_56_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_57_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_57_state.msgSpecs.splice(0, N_n_0_57_state.msgSpecs.length - 1)
                    N_n_0_57_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_57_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_57_state.msgSpecs.length; i++) {
                        if (N_n_0_57_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_57_state.msgSpecs[i].send, N_n_0_57_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_57_snds_0(N_n_0_57_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_57", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_57_0_rcvs_0(m) {
                            
                IO_snd_n_0_57_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_57_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_88_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_88_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 8
                            ) {
                                N_n_0_88_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 16
                            ) {
                                N_n_0_88_snds_2(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 24
                            ) {
                                N_n_0_88_snds_3(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 32
                            ) {
                                N_n_0_88_snds_4(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 40
                            ) {
                                N_n_0_88_snds_5(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 48
                            ) {
                                N_n_0_88_snds_6(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 56
                            ) {
                                N_n_0_88_snds_7(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_88", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_89_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_89_state.msgSpecs.splice(0, N_n_0_89_state.msgSpecs.length - 1)
                    N_n_0_89_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_89_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_89_state.msgSpecs.length; i++) {
                        if (N_n_0_89_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_89_state.msgSpecs[i].send, N_n_0_89_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_89_snds_0(N_n_0_89_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_89", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_93_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_93_state, G_msg_readFloatToken(m, 0))
                        N_n_0_94_rcvs_0(G_msg_floats([N_n_0_93_state.leftOp + N_n_0_93_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_94_rcvs_0(G_msg_floats([N_n_0_93_state.leftOp + N_n_0_93_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_93", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_93_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_93_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_93", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_94_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_0_95_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_94", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_95_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_95_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_95_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_95_0_sig_outs_0 = 0
function N_m_n_0_95_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_95_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_95_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_89_0_rcvs_0(m) {
                            
                IO_snd_n_0_89_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_89_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_96_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_96_state.msgSpecs.splice(0, N_n_0_96_state.msgSpecs.length - 1)
                    N_n_0_96_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_96_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_96_state.msgSpecs.length; i++) {
                        if (N_n_0_96_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_96_state.msgSpecs[i].send, N_n_0_96_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_96_snds_0(N_n_0_96_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_96", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_100_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_100_state, G_msg_readFloatToken(m, 0))
                        N_n_0_101_rcvs_0(G_msg_floats([N_n_0_100_state.leftOp + N_n_0_100_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_101_rcvs_0(G_msg_floats([N_n_0_100_state.leftOp + N_n_0_100_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_100", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_100_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_100_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_100", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_101_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_0_102_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_101", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_102_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_102_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_102_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_102_0_sig_outs_0 = 0
function N_m_n_0_102_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_102_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_102_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_96_0_rcvs_0(m) {
                            
                IO_snd_n_0_96_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_96_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_103_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_103_state.msgSpecs.splice(0, N_n_0_103_state.msgSpecs.length - 1)
                    N_n_0_103_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_103_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_103_state.msgSpecs.length; i++) {
                        if (N_n_0_103_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_103_state.msgSpecs[i].send, N_n_0_103_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_103_snds_0(N_n_0_103_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_103", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_107_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_107_state, G_msg_readFloatToken(m, 0))
                        N_n_0_108_rcvs_0(G_msg_floats([N_n_0_107_state.leftOp + N_n_0_107_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_108_rcvs_0(G_msg_floats([N_n_0_107_state.leftOp + N_n_0_107_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_107", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_107_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_107_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_107", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_108_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_0_109_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_108", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_109_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_109_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_109_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_109_0_sig_outs_0 = 0
function N_m_n_0_109_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_109_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_109_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_103_0_rcvs_0(m) {
                            
                IO_snd_n_0_103_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_103_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_112_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_112_state, m)
            return
        
                            throw new Error('Node "n_0_112", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_115_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_115_state, 
                            () => N_n_0_114_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_115_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_115_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_115_state,
                        () => N_n_0_114_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_115_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_115", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_114_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_114_state.msgSpecs.splice(0, N_n_0_114_state.msgSpecs.length - 1)
                    N_n_0_114_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_114_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_114_state.msgSpecs.length; i++) {
                        if (N_n_0_114_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_114_state.msgSpecs[i].send, N_n_0_114_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_114_snds_0(N_n_0_114_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_114", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_113_outs_0 = 0
function N_n_0_113_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_113_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_113_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_113_state)
                return
    
            }
        
                            throw new Error('Node "n_0_113", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_114_0_rcvs_0(m) {
                            
                IO_snd_n_0_114_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_114_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_117_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_117_state, 
                            () => N_n_0_116_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_117_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_117_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_117_state,
                        () => N_n_0_116_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_117_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_117", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_116_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_116_state.msgSpecs.splice(0, N_n_0_116_state.msgSpecs.length - 1)
                    N_n_0_116_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_116_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_116_state.msgSpecs.length; i++) {
                        if (N_n_0_116_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_116_state.msgSpecs[i].send, N_n_0_116_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_116_snds_0(N_n_0_116_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_116", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_116_0_rcvs_0(m) {
                            
                IO_snd_n_0_116_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_116_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_90_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_90_state.msgSpecs.splice(0, N_n_0_90_state.msgSpecs.length - 1)
                    N_n_0_90_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_90_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_90_state.msgSpecs.length; i++) {
                        if (N_n_0_90_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_90_state.msgSpecs[i].send, N_n_0_90_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_90_snds_0(N_n_0_90_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_90", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_90_0_rcvs_0(m) {
                            
                IO_snd_n_0_90_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_90_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_97_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_97_state.msgSpecs.splice(0, N_n_0_97_state.msgSpecs.length - 1)
                    N_n_0_97_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_97_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_97_state.msgSpecs.length; i++) {
                        if (N_n_0_97_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_97_state.msgSpecs[i].send, N_n_0_97_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_97_snds_0(N_n_0_97_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_97", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_97_0_rcvs_0(m) {
                            
                IO_snd_n_0_97_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_97_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_104_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_104_state.msgSpecs.splice(0, N_n_0_104_state.msgSpecs.length - 1)
                    N_n_0_104_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_104_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_104_state.msgSpecs.length; i++) {
                        if (N_n_0_104_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_104_state.msgSpecs[i].send, N_n_0_104_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_104_snds_0(N_n_0_104_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_104", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_104_0_rcvs_0(m) {
                            
                IO_snd_n_0_104_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_104_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_91_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_91_state.msgSpecs.splice(0, N_n_0_91_state.msgSpecs.length - 1)
                    N_n_0_91_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_91_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_91_state.msgSpecs.length; i++) {
                        if (N_n_0_91_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_91_state.msgSpecs[i].send, N_n_0_91_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_91_snds_0(N_n_0_91_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_91", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_91_0_rcvs_0(m) {
                            
                IO_snd_n_0_91_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_91_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_98_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_98_state.msgSpecs.splice(0, N_n_0_98_state.msgSpecs.length - 1)
                    N_n_0_98_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_98_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_98_state.msgSpecs.length; i++) {
                        if (N_n_0_98_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_98_state.msgSpecs[i].send, N_n_0_98_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_98_snds_0(N_n_0_98_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_98", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_98_0_rcvs_0(m) {
                            
                IO_snd_n_0_98_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_98_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_105_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_105_state.msgSpecs.splice(0, N_n_0_105_state.msgSpecs.length - 1)
                    N_n_0_105_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_105_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_105_state.msgSpecs.length; i++) {
                        if (N_n_0_105_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_105_state.msgSpecs[i].send, N_n_0_105_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_105_snds_0(N_n_0_105_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_105", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_105_0_rcvs_0(m) {
                            
                IO_snd_n_0_105_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_105_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_92_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_92_state.msgSpecs.splice(0, N_n_0_92_state.msgSpecs.length - 1)
                    N_n_0_92_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_92_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_92_state.msgSpecs.length; i++) {
                        if (N_n_0_92_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_92_state.msgSpecs[i].send, N_n_0_92_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_92_snds_0(N_n_0_92_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_92", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_92_0_rcvs_0(m) {
                            
                IO_snd_n_0_92_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_92_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_99_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_99_state.msgSpecs.splice(0, N_n_0_99_state.msgSpecs.length - 1)
                    N_n_0_99_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_99_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_99_state.msgSpecs.length; i++) {
                        if (N_n_0_99_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_99_state.msgSpecs[i].send, N_n_0_99_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_99_snds_0(N_n_0_99_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_99", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_99_0_rcvs_0(m) {
                            
                IO_snd_n_0_99_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_99_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_106_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_106_state.msgSpecs.splice(0, N_n_0_106_state.msgSpecs.length - 1)
                    N_n_0_106_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_106_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_106_state.msgSpecs.length; i++) {
                        if (N_n_0_106_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_106_state.msgSpecs[i].send, N_n_0_106_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_106_snds_0(N_n_0_106_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_106", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_106_0_rcvs_0(m) {
                            
                IO_snd_n_0_106_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_106_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_124_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_124_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_0_124_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 8
                            ) {
                                N_n_0_124_snds_2(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 14
                            ) {
                                N_n_0_124_snds_3(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 16
                            ) {
                                N_n_0_124_snds_4(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 22
                            ) {
                                N_n_0_124_snds_5(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 24
                            ) {
                                N_n_0_124_snds_6(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 30
                            ) {
                                N_n_0_124_snds_7(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 32
                            ) {
                                N_n_0_124_snds_8(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 38
                            ) {
                                N_n_0_124_snds_9(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 40
                            ) {
                                N_n_0_124_snds_10(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 46
                            ) {
                                N_n_0_124_snds_11(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 48
                            ) {
                                N_n_0_124_snds_12(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 54
                            ) {
                                N_n_0_124_snds_13(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 56
                            ) {
                                N_n_0_124_snds_14(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 62
                            ) {
                                N_n_0_124_snds_15(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_124", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_125_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_125_state.msgSpecs.splice(0, N_n_0_125_state.msgSpecs.length - 1)
                    N_n_0_125_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_125_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_125_state.msgSpecs.length; i++) {
                        if (N_n_0_125_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_125_state.msgSpecs[i].send, N_n_0_125_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_125_snds_0(N_n_0_125_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_125", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_128_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_128_state, G_msg_readFloatToken(m, 0))
                        N_n_0_129_rcvs_0(G_msg_floats([N_n_0_128_state.leftOp + N_n_0_128_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_129_rcvs_0(G_msg_floats([N_n_0_128_state.leftOp + N_n_0_128_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_128", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_128_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_128_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_128", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_129_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_0_130_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_129", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_130_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_130_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_130_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_130_0_sig_outs_0 = 0
function N_m_n_0_130_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_130_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_130_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_125_0_rcvs_0(m) {
                            
                IO_snd_n_0_125_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_125_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_132_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_132_state, m)
            return
        
                            throw new Error('Node "n_0_132", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_134_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_134_state.msgSpecs.splice(0, N_n_0_134_state.msgSpecs.length - 1)
                    N_n_0_134_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_134_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_134_state.msgSpecs.length; i++) {
                        if (N_n_0_134_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_134_state.msgSpecs[i].send, N_n_0_134_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_134_snds_0(N_n_0_134_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_134", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_133_outs_0 = 0
function N_n_0_133_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_133_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_133_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_133_state)
                return
    
            }
        
                            throw new Error('Node "n_0_133", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_134_0_rcvs_0(m) {
                            
                IO_snd_n_0_134_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_134_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_136_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_136_state, 
                            () => N_n_0_135_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_136_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_136_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_136_state,
                        () => N_n_0_135_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_136_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_136", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_135_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_135_state.msgSpecs.splice(0, N_n_0_135_state.msgSpecs.length - 1)
                    N_n_0_135_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_135_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_135_state.msgSpecs.length; i++) {
                        if (N_n_0_135_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_135_state.msgSpecs[i].send, N_n_0_135_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_135_snds_0(N_n_0_135_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_135", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_135_0_rcvs_0(m) {
                            
                IO_snd_n_0_135_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_135_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_126_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_126_state.msgSpecs.splice(0, N_n_0_126_state.msgSpecs.length - 1)
                    N_n_0_126_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_126_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_126_state.msgSpecs.length; i++) {
                        if (N_n_0_126_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_126_state.msgSpecs[i].send, N_n_0_126_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_126_snds_0(N_n_0_126_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_126", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_126_0_rcvs_0(m) {
                            
                IO_snd_n_0_126_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_126_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_127_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_127_state.msgSpecs.splice(0, N_n_0_127_state.msgSpecs.length - 1)
                    N_n_0_127_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_127_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_127_state.msgSpecs.length; i++) {
                        if (N_n_0_127_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_127_state.msgSpecs[i].send, N_n_0_127_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_127_snds_0(N_n_0_127_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_127", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_127_0_rcvs_0(m) {
                            
                IO_snd_n_0_127_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_127_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_248_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 8
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 14
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 16
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 22
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 24
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 30
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 32
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 38
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 40
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 46
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 48
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 52
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 54
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 56
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 58
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 62
                            ) {
                                N_n_0_249_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_248", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_249_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_249_state, m)
            return
        
                            throw new Error('Node "n_0_249", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_251_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_251_state.msgSpecs.splice(0, N_n_0_251_state.msgSpecs.length - 1)
                    N_n_0_251_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_251_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_251_state.msgSpecs.length; i++) {
                        if (N_n_0_251_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_251_state.msgSpecs[i].send, N_n_0_251_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_251_snds_0(N_n_0_251_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_251", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_250_outs_0 = 0
function N_n_0_250_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_250_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_250_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_250_state)
                return
    
            }
        
                            throw new Error('Node "n_0_250", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_251_0_rcvs_0(m) {
                            
                IO_snd_n_0_251_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_251_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_253_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_253_state, 
                            () => N_n_0_252_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_253_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_253_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_253_state,
                        () => N_n_0_252_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_253_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_253", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_252_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_252_state.msgSpecs.splice(0, N_n_0_252_state.msgSpecs.length - 1)
                    N_n_0_252_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_252_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_252_state.msgSpecs.length; i++) {
                        if (N_n_0_252_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_252_state.msgSpecs[i].send, N_n_0_252_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_252_snds_0(N_n_0_252_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_252", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_252_0_rcvs_0(m) {
                            
                IO_snd_n_0_252_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_252_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_257_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 12
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 20
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 28
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 36
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 44
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 52
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 58
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 60
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 61
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 62
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 63
                            ) {
                                N_n_0_258_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_257", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_258_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_258_state, m)
            return
        
                            throw new Error('Node "n_0_258", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_260_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_260_state.msgSpecs.splice(0, N_n_0_260_state.msgSpecs.length - 1)
                    N_n_0_260_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_260_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_260_state.msgSpecs.length; i++) {
                        if (N_n_0_260_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_260_state.msgSpecs[i].send, N_n_0_260_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_260_snds_0(N_n_0_260_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_260", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_259_outs_0 = 0
function N_n_0_259_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_259_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_259_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_259_state)
                return
    
            }
        
                            throw new Error('Node "n_0_259", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_260_0_rcvs_0(m) {
                            
                IO_snd_n_0_260_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_260_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_262_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_262_state, 
                            () => N_n_0_261_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_262_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_262_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_262_state,
                        () => N_n_0_261_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_262_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_262", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_261_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_261_state.msgSpecs.splice(0, N_n_0_261_state.msgSpecs.length - 1)
                    N_n_0_261_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_261_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_261_state.msgSpecs.length; i++) {
                        if (N_n_0_261_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_261_state.msgSpecs[i].send, N_n_0_261_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_261_snds_0(N_n_0_261_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_261", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_261_0_rcvs_0(m) {
                            
                IO_snd_n_0_261_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_261_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_267_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 10
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 14
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 18
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 22
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 26
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 30
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 34
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 38
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 42
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 46
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 48
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 50
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 52
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 54
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 56
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 58
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 60
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 61
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 62
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 63
                            ) {
                                N_n_0_268_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_267", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_268_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_268_state, m)
            return
        
                            throw new Error('Node "n_0_268", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_270_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_270_state.msgSpecs.splice(0, N_n_0_270_state.msgSpecs.length - 1)
                    N_n_0_270_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_270_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_270_state.msgSpecs.length; i++) {
                        if (N_n_0_270_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_270_state.msgSpecs[i].send, N_n_0_270_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_270_snds_0(N_n_0_270_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_270", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_269_outs_0 = 0
function N_n_0_269_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_269_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_269_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_269_state)
                return
    
            }
        
                            throw new Error('Node "n_0_269", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_270_0_rcvs_0(m) {
                            
                IO_snd_n_0_270_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_270_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_272_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_272_state, 
                            () => N_n_0_271_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_272_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_272_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_272_state,
                        () => N_n_0_271_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_272_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_272", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_271_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_271_state.msgSpecs.splice(0, N_n_0_271_state.msgSpecs.length - 1)
                    N_n_0_271_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_271_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_271_state.msgSpecs.length; i++) {
                        if (N_n_0_271_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_271_state.msgSpecs[i].send, N_n_0_271_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_271_snds_0(N_n_0_271_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_271", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_271_0_rcvs_0(m) {
                            
                IO_snd_n_0_271_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_271_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_289_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 10
                            ) {
                                N_n_0_293_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 26
                            ) {
                                N_n_0_293_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 42
                            ) {
                                N_n_0_293_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 58
                            ) {
                                N_n_0_293_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_289", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_293_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_293_state, m)
            return
        
                            throw new Error('Node "n_0_293", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_297_outs_0 = 0
let N_n_0_297_outs_1 = 0
function N_n_0_297_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                NT_tabplay_t_play(N_n_0_297_state, 0, N_n_0_297_state.array.length)
                return 
                
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_tabplay_t_stop(N_n_0_297_state)
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabplay_t_setArrayName(
                    N_n_0_297_state,
                    G_msg_readStringToken(m, 1),
                    () => NT_tabplay_t_setArrayNameFinalize(N_n_0_297_state),
                )
                return
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_tabplay_t_play(
                    N_n_0_297_state,
                    toInt(G_msg_readFloatToken(m, 0)), 
                    N_n_0_297_state.array.length
                )
                return 
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])) {
                const fromSample = toInt(G_msg_readFloatToken(m, 0))
                NT_tabplay_t_play(
                    N_n_0_297_state,
                    fromSample,
                    fromSample + toInt(G_msg_readFloatToken(m, 1)),
                )
                return
            }
        
                            throw new Error('Node "n_0_297", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_290_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_294_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 20
                            ) {
                                N_n_0_294_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 36
                            ) {
                                N_n_0_294_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 52
                            ) {
                                N_n_0_294_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_290", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_294_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_294_state, m)
            return
        
                            throw new Error('Node "n_0_294", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_298_outs_0 = 0
let N_n_0_298_outs_1 = 0
function N_n_0_298_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                NT_tabplay_t_play(N_n_0_298_state, 0, N_n_0_298_state.array.length)
                return 
                
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_tabplay_t_stop(N_n_0_298_state)
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabplay_t_setArrayName(
                    N_n_0_298_state,
                    G_msg_readStringToken(m, 1),
                    () => NT_tabplay_t_setArrayNameFinalize(N_n_0_298_state),
                )
                return
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_tabplay_t_play(
                    N_n_0_298_state,
                    toInt(G_msg_readFloatToken(m, 0)), 
                    N_n_0_298_state.array.length
                )
                return 
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])) {
                const fromSample = toInt(G_msg_readFloatToken(m, 0))
                NT_tabplay_t_play(
                    N_n_0_298_state,
                    fromSample,
                    fromSample + toInt(G_msg_readFloatToken(m, 1)),
                )
                return
            }
        
                            throw new Error('Node "n_0_298", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_291_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 12
                            ) {
                                N_n_0_295_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 28
                            ) {
                                N_n_0_295_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 44
                            ) {
                                N_n_0_295_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 60
                            ) {
                                N_n_0_295_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_291", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_295_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_295_state, m)
            return
        
                            throw new Error('Node "n_0_295", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_299_outs_0 = 0
let N_n_0_299_outs_1 = 0
function N_n_0_299_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                NT_tabplay_t_play(N_n_0_299_state, 0, N_n_0_299_state.array.length)
                return 
                
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_tabplay_t_stop(N_n_0_299_state)
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabplay_t_setArrayName(
                    N_n_0_299_state,
                    G_msg_readStringToken(m, 1),
                    () => NT_tabplay_t_setArrayNameFinalize(N_n_0_299_state),
                )
                return
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_tabplay_t_play(
                    N_n_0_299_state,
                    toInt(G_msg_readFloatToken(m, 0)), 
                    N_n_0_299_state.array.length
                )
                return 
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])) {
                const fromSample = toInt(G_msg_readFloatToken(m, 0))
                NT_tabplay_t_play(
                    N_n_0_299_state,
                    fromSample,
                    fromSample + toInt(G_msg_readFloatToken(m, 1)),
                )
                return
            }
        
                            throw new Error('Node "n_0_299", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_292_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 15
                            ) {
                                N_n_0_296_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 31
                            ) {
                                N_n_0_296_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 47
                            ) {
                                N_n_0_296_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 63
                            ) {
                                N_n_0_296_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_292", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_296_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_296_state, m)
            return
        
                            throw new Error('Node "n_0_296", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_300_outs_0 = 0
let N_n_0_300_outs_1 = 0
function N_n_0_300_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                NT_tabplay_t_play(N_n_0_300_state, 0, N_n_0_300_state.array.length)
                return 
                
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_tabplay_t_stop(N_n_0_300_state)
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_tabplay_t_setArrayName(
                    N_n_0_300_state,
                    G_msg_readStringToken(m, 1),
                    () => NT_tabplay_t_setArrayNameFinalize(N_n_0_300_state),
                )
                return
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_tabplay_t_play(
                    N_n_0_300_state,
                    toInt(G_msg_readFloatToken(m, 0)), 
                    N_n_0_300_state.array.length
                )
                return 
    
            } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])) {
                const fromSample = toInt(G_msg_readFloatToken(m, 0))
                NT_tabplay_t_play(
                    N_n_0_300_state,
                    fromSample,
                    fromSample + toInt(G_msg_readFloatToken(m, 1)),
                )
                return
            }
        
                            throw new Error('Node "n_0_300", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_205_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mod_setLeft(N_n_0_205_state, G_msg_readFloatToken(m, 0))
                        N_n_0_206_rcvs_0(G_msg_floats([N_n_0_205_state.rightOp !== 0 ? (N_n_0_205_state.rightOp + (N_n_0_205_state.leftOp % N_n_0_205_state.rightOp)) % N_n_0_205_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_206_rcvs_0(G_msg_floats([N_n_0_205_state.rightOp !== 0 ? (N_n_0_205_state.rightOp + (N_n_0_205_state.leftOp % N_n_0_205_state.rightOp)) % N_n_0_205_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_205", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_206_rcvs_0(m) {
                            
                    if (N_n_0_206_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_206_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_206_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_206_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_206_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_207_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_206_state.stringFilter
                        ) {
                            N_n_0_207_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_206_state.floatFilter
                    ) {
                        N_n_0_207_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_206", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_207_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_0_207_state, G_msg_readFloatToken(m, 0))
                N_n_0_207_snds_0(G_msg_floats([N_n_0_207_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_207_snds_0(G_msg_floats([N_n_0_207_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_207", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_207_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_float_setValue(N_n_0_207_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_207", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_208_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_eq_setLeft(N_n_0_208_state, G_msg_readFloatToken(m, 0))
                        N_n_0_207_rcvs_1(G_msg_floats([N_n_0_208_state.leftOp == N_n_0_208_state.rightOp ? 1: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_207_rcvs_1(G_msg_floats([N_n_0_208_state.leftOp == N_n_0_208_state.rightOp ? 1: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_208", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_209_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_209_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_209_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_209", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_210_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_210_state, 
                            () => N_n_0_210_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_210_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_210_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_210_state,
                        () => N_n_0_210_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_210_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_210", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_211_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_211_state, 
                            () => N_n_0_211_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_211_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_211_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_211_state,
                        () => N_n_0_211_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_211_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_211", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_212_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_212_state, 
                            () => N_n_0_212_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_212_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_212_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_212_state,
                        () => N_n_0_212_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_212_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_212", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_213_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_213_state, 
                            () => N_n_0_213_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_213_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_213_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_213_state,
                        () => N_n_0_213_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_213_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_213", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_214_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_214_state, 
                            () => N_n_0_214_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_214_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_214_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_214_state,
                        () => N_n_0_214_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_214_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_214", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_225_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_225_state.msgSpecs.splice(0, N_n_0_225_state.msgSpecs.length - 1)
                    N_n_0_225_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_225_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_225_state.msgSpecs.length; i++) {
                        if (N_n_0_225_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_225_state.msgSpecs[i].send, N_n_0_225_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_225_snds_0(N_n_0_225_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_225", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_226_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_226_state, G_msg_readFloatToken(m, 0))
                        N_n_0_227_rcvs_0(G_msg_floats([N_n_0_226_state.leftOp + N_n_0_226_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_227_rcvs_0(G_msg_floats([N_n_0_226_state.leftOp + N_n_0_226_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_226", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_226_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_226_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_226", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_227_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_0_227_snds_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_227", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_228_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_228_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_228_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_228_0_sig_outs_0 = 0
function N_m_n_0_228_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_228_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_228_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_229_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_0_229_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_230_0__routemsg_rcvs_0(G_msg_floats([N_n_0_229_state.leftOp * N_n_0_229_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_230_0__routemsg_rcvs_0(G_msg_floats([N_n_0_229_state.leftOp * N_n_0_229_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_229", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_230_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_230_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_230_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_230_0_sig_outs_0 = 0
function N_m_n_0_230_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_230_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_230_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_225_0_rcvs_0(m) {
                            
                IO_snd_n_0_225_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_225_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_233_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_233_state, m)
            return
        
                            throw new Error('Node "n_0_233", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_235_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_235_state.msgSpecs.splice(0, N_n_0_235_state.msgSpecs.length - 1)
                    N_n_0_235_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_235_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_235_state.msgSpecs.length; i++) {
                        if (N_n_0_235_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_235_state.msgSpecs[i].send, N_n_0_235_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_235_snds_0(N_n_0_235_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_235", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_234_outs_0 = 0
function N_n_0_234_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_234_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_234_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_234_state)
                return
    
            }
        
                            throw new Error('Node "n_0_234", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_235_0_rcvs_0(m) {
                            
                IO_snd_n_0_235_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_235_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_237_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_237_state, 
                            () => N_n_0_236_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_237_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_237_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_237_state,
                        () => N_n_0_236_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_237_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_237", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_236_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_236_state.msgSpecs.splice(0, N_n_0_236_state.msgSpecs.length - 1)
                    N_n_0_236_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_236_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_236_state.msgSpecs.length; i++) {
                        if (N_n_0_236_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_236_state.msgSpecs[i].send, N_n_0_236_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_236_snds_0(N_n_0_236_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_236", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_236_0_rcvs_0(m) {
                            
                IO_snd_n_0_236_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_236_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_224_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_224_state.msgSpecs.splice(0, N_n_0_224_state.msgSpecs.length - 1)
                    N_n_0_224_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_224_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_224_state.msgSpecs.length; i++) {
                        if (N_n_0_224_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_224_state.msgSpecs[i].send, N_n_0_224_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_224_snds_0(N_n_0_224_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_224", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_224_0_rcvs_0(m) {
                            
                IO_snd_n_0_224_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_224_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_223_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_223_state.msgSpecs.splice(0, N_n_0_223_state.msgSpecs.length - 1)
                    N_n_0_223_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_223_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_223_state.msgSpecs.length; i++) {
                        if (N_n_0_223_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_223_state.msgSpecs[i].send, N_n_0_223_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_223_snds_0(N_n_0_223_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_223", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_223_0_rcvs_0(m) {
                            
                IO_snd_n_0_223_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_223_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_222_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_222_state.msgSpecs.splice(0, N_n_0_222_state.msgSpecs.length - 1)
                    N_n_0_222_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_222_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_222_state.msgSpecs.length; i++) {
                        if (N_n_0_222_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_222_state.msgSpecs[i].send, N_n_0_222_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_222_snds_0(N_n_0_222_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_222", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_222_0_rcvs_0(m) {
                            
                IO_snd_n_0_222_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_222_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_221_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_221_state.msgSpecs.splice(0, N_n_0_221_state.msgSpecs.length - 1)
                    N_n_0_221_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_221_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_221_state.msgSpecs.length; i++) {
                        if (N_n_0_221_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_221_state.msgSpecs[i].send, N_n_0_221_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_221_snds_0(N_n_0_221_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_221", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_221_0_rcvs_0(m) {
                            
                IO_snd_n_0_221_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_221_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_220_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_220_state.msgSpecs.splice(0, N_n_0_220_state.msgSpecs.length - 1)
                    N_n_0_220_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_220_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_220_state.msgSpecs.length; i++) {
                        if (N_n_0_220_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_220_state.msgSpecs[i].send, N_n_0_220_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_220_snds_0(N_n_0_220_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_220", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_220_0_rcvs_0(m) {
                            
                IO_snd_n_0_220_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_220_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_240_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_240_state.msgSpecs.splice(0, N_n_0_240_state.msgSpecs.length - 1)
                    N_n_0_240_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_240_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_240_state.msgSpecs.length; i++) {
                        if (N_n_0_240_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_240_state.msgSpecs[i].send, N_n_0_240_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_240_snds_0(N_n_0_240_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_240", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_242_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_242_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_242_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_242_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_242_state.nextDurationSamp === 0) {
                            N_n_0_242_state.currentValue = targetValue
                            N_n_0_242_snds_0(G_msg_floats([targetValue]))
                        } else {
                            N_n_0_242_snds_0(G_msg_floats([N_n_0_242_state.currentValue]))
                            NT_line_setNewLine(N_n_0_242_state, targetValue)
                            NT_line_incrementTime(N_n_0_242_state, N_n_0_242_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_242_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_242_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_242_state)
                N_n_0_242_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_242", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_245_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_245_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_245_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_245_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_245_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_245_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_2_rcvs_0(m) {
                            
            N_n_0_244_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_13_3_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_13_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_13_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_244_rcvs_0(G_msg_floats([N_n_13_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_244_rcvs_0(G_msg_floats([N_n_13_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_13_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_244_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_244_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_246_1__routemsg_rcvs_0(G_msg_floats([N_n_0_244_state.leftOp - N_n_0_244_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_246_1__routemsg_rcvs_0(G_msg_floats([N_n_0_244_state.leftOp - N_n_0_244_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_244", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_244_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_sub_setRight(N_n_0_244_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_244", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_246_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_246_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_246_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_246_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_246_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_246_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_240_0_rcvs_0(m) {
                            
                IO_snd_n_0_240_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_240_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_215_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_215_state, 
                            () => N_n_0_215_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_215_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_215_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_215_state,
                        () => N_n_0_215_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_215_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_215", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_216_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_216_state, 
                            () => N_n_0_216_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_216_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_216_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_216_state,
                        () => N_n_0_216_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_216_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_216", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_217_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_217_state, 
                            () => N_n_0_217_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_217_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_217_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_217_state,
                        () => N_n_0_217_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_217_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_217", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_218_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_218_state, 
                            () => N_n_0_218_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_218_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_218_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_218_state,
                        () => N_n_0_218_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_218_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_218", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_219_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_219_state, 
                            () => N_n_0_219_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_219_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_219_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_219_state,
                        () => N_n_0_219_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_219_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_219", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_241_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_241_state.msgSpecs.splice(0, N_n_0_241_state.msgSpecs.length - 1)
                    N_n_0_241_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_241_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_241_state.msgSpecs.length; i++) {
                        if (N_n_0_241_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_241_state.msgSpecs[i].send, N_n_0_241_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_241_snds_0(N_n_0_241_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_241", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_241_0_rcvs_0(m) {
                            
                IO_snd_n_0_241_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_241_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_7_0_rcvs_0(m) {
                            
                IO_snd_n_0_7_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_7_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_6_0_rcvs_0(m) {
                            
                IO_snd_n_0_6_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_6_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_11_state.msgSpecs.splice(0, N_n_0_11_state.msgSpecs.length - 1)
                    N_n_0_11_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_11_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_11_state.msgSpecs.length; i++) {
                        if (N_n_0_11_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_11_state.msgSpecs[i].send, N_n_0_11_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_11_snds_0(N_n_0_11_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_144_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_144_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_144_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_144_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_144", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_145_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_146_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_145_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_145", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_146_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_146_state, G_msg_readFloatToken(m, 0))
                        N_n_0_147_rcvs_0(G_msg_floats([N_n_0_146_state.leftOp + N_n_0_146_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_147_rcvs_0(G_msg_floats([N_n_0_146_state.leftOp + N_n_0_146_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_146", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_147_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_147_state.msgSpecs.splice(0, N_n_0_147_state.msgSpecs.length - 1)
                    N_n_0_147_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_147_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_147_state.msgSpecs.length; i++) {
                        if (N_n_0_147_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_147_state.msgSpecs[i].send, N_n_0_147_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_147_snds_0(N_n_0_147_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_147", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_148_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_148_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_148_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_148_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_148_state.nextDurationSamp === 0) {
                            N_n_0_148_state.currentValue = targetValue
                            N_m_n_0_143_1__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_0_143_1__routemsg_rcvs_0(G_msg_floats([N_n_0_148_state.currentValue]))
                            NT_line_setNewLine(N_n_0_148_state, targetValue)
                            NT_line_incrementTime(N_n_0_148_state, N_n_0_148_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_148_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_148_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_148_state)
                N_n_0_148_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_148", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_143_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_143_1__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_143_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_143_1_sig_outs_0 = 0
function N_m_n_0_143_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_143_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_143_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_147_0_rcvs_0(m) {
                            
                IO_snd_n_0_147_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_147_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_153_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_153_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_153_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_153_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_153", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_154_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_155_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_154_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_154", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_155_rcvs_0(m) {
                            
                    if (N_n_0_155_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_155_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_155_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_155_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_155_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_155_snds_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_155_state.stringFilter
                        ) {
                            N_n_0_155_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_155_state.floatFilter
                    ) {
                        N_n_0_155_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_155", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_156_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_157_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_156_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_156", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_157_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_157_state, G_msg_readFloatToken(m, 0))
                        N_n_0_158_rcvs_0(G_msg_floats([N_n_0_157_state.leftOp + N_n_0_157_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_158_rcvs_0(G_msg_floats([N_n_0_157_state.leftOp + N_n_0_157_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_157", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_158_rcvs_0(m) {
                            
            N_n_0_159_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_160_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_0_158", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_160_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_0_160_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_0_160_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_0_160_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_0_160_state.floatValues[1])
    
            N_n_0_161_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_0_160", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_160_rcvs_1(m) {
                            
                        N_n_0_160_state.floatValues[1] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_0_160", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_161_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_161_state.msgSpecs.splice(0, N_n_0_161_state.msgSpecs.length - 1)
                    N_n_0_161_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_161_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_161_state.msgSpecs.length; i++) {
                        if (N_n_0_161_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_161_state.msgSpecs[i].send, N_n_0_161_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_161_snds_0(N_n_0_161_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_161", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_162_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_162_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_162_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_162_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_162_state.nextDurationSamp === 0) {
                            N_n_0_162_state.currentValue = targetValue
                            N_m_n_0_163_0__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_0_163_0__routemsg_rcvs_0(G_msg_floats([N_n_0_162_state.currentValue]))
                            NT_line_setNewLine(N_n_0_162_state, targetValue)
                            NT_line_incrementTime(N_n_0_162_state, N_n_0_162_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_162_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_162_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_162_state)
                N_n_0_162_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_162", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_163_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_163_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_163_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_163_0_sig_outs_0 = 0
function N_m_n_0_163_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_163_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_163_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_161_0_rcvs_0(m) {
                            
                IO_snd_n_0_161_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_161_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_159_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_159_state, G_msg_readFloatToken(m, 0))
                        N_n_0_160_rcvs_1(G_msg_floats([N_n_0_159_state.leftOp - N_n_0_159_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_160_rcvs_1(G_msg_floats([N_n_0_159_state.leftOp - N_n_0_159_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_159", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_165_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_165_state.msgSpecs.splice(0, N_n_0_165_state.msgSpecs.length - 1)
                    N_n_0_165_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_165_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_165_state.msgSpecs.length; i++) {
                        if (N_n_0_165_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_165_state.msgSpecs[i].send, N_n_0_165_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_165_snds_0(N_n_0_165_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_165", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_164_outs_0 = 0
function N_n_0_164_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_164_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_164_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_164_state)
                return
    
            }
        
                            throw new Error('Node "n_0_164", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_165_0_rcvs_0(m) {
                            
                IO_snd_n_0_165_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_165_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_167_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_167_state, 
                            () => N_n_0_166_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_167_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_167_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_167_state,
                        () => N_n_0_166_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_167_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_167", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_166_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_166_state.msgSpecs.splice(0, N_n_0_166_state.msgSpecs.length - 1)
                    N_n_0_166_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_166_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_166_state.msgSpecs.length; i++) {
                        if (N_n_0_166_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_166_state.msgSpecs[i].send, N_n_0_166_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_166_snds_0(N_n_0_166_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_166", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_166_0_rcvs_0(m) {
                            
                IO_snd_n_0_166_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_166_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_171_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_172_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_171_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_171", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_172_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_0_172_state, G_msg_readFloatToken(m, 0))
                        N_n_0_173_rcvs_0(G_msg_floats([N_n_0_172_state.rightOp !== 0 ? N_n_0_172_state.leftOp / N_n_0_172_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_173_rcvs_0(G_msg_floats([N_n_0_172_state.rightOp !== 0 ? N_n_0_172_state.leftOp / N_n_0_172_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_172", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_173_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_173_state.msgSpecs.splice(0, N_n_0_173_state.msgSpecs.length - 1)
                    N_n_0_173_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_173_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_173_state.msgSpecs.length; i++) {
                        if (N_n_0_173_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_173_state.msgSpecs[i].send, N_n_0_173_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_173_snds_0(N_n_0_173_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_173", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_174_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_174_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_174_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_174_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_174_state.nextDurationSamp === 0) {
                            N_n_0_174_state.currentValue = targetValue
                            N_n_0_174_snds_0(G_msg_floats([targetValue]))
                        } else {
                            N_n_0_174_snds_0(G_msg_floats([N_n_0_174_state.currentValue]))
                            NT_line_setNewLine(N_n_0_174_state, targetValue)
                            NT_line_incrementTime(N_n_0_174_state, N_n_0_174_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_174_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_174_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_174_state)
                N_n_0_174_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_174", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_177_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_177_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_177_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_177_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_177_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_177_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_2_rcvs_0(m) {
                            
            N_n_0_176_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_11_3_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_11_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_11_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_176_rcvs_0(G_msg_floats([N_n_11_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_176_rcvs_0(G_msg_floats([N_n_11_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_11_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_176_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_176_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_178_1__routemsg_rcvs_0(G_msg_floats([N_n_0_176_state.leftOp - N_n_0_176_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_178_1__routemsg_rcvs_0(G_msg_floats([N_n_0_176_state.leftOp - N_n_0_176_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_176", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_176_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_sub_setRight(N_n_0_176_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_176", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_178_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_178_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_178_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_178_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_178_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_178_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_173_0_rcvs_0(m) {
                            
                IO_snd_n_0_173_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_173_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_179_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_179_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_179_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_179_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_179", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_180_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_181_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_180_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_180", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_181_rcvs_0(m) {
                            
                    if (N_n_0_181_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_181_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_181_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_181_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_181_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_181_snds_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_181_state.stringFilter
                        ) {
                            N_n_0_181_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_181_state.floatFilter
                    ) {
                        N_n_0_181_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_181", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_182_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_183_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_182_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_182", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_183_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_183_state, G_msg_readFloatToken(m, 0))
                        N_n_0_184_rcvs_0(G_msg_floats([N_n_0_183_state.leftOp + N_n_0_183_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_184_rcvs_0(G_msg_floats([N_n_0_183_state.leftOp + N_n_0_183_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_183", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_184_rcvs_0(m) {
                            
            N_n_0_185_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_186_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_0_184", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_186_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_0_186_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_0_186_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_0_186_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_0_186_state.floatValues[1])
    
            N_n_0_187_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_0_186", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_186_rcvs_1(m) {
                            
                        N_n_0_186_state.floatValues[1] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_0_186", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_187_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_187_state.msgSpecs.splice(0, N_n_0_187_state.msgSpecs.length - 1)
                    N_n_0_187_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_187_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_187_state.msgSpecs.length; i++) {
                        if (N_n_0_187_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_187_state.msgSpecs[i].send, N_n_0_187_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_187_snds_0(N_n_0_187_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_187", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_188_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_188_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_188_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_188_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_188_state.nextDurationSamp === 0) {
                            N_n_0_188_state.currentValue = targetValue
                            N_m_n_0_189_0__routemsg_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_m_n_0_189_0__routemsg_rcvs_0(G_msg_floats([N_n_0_188_state.currentValue]))
                            NT_line_setNewLine(N_n_0_188_state, targetValue)
                            NT_line_incrementTime(N_n_0_188_state, N_n_0_188_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_188_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_188_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_188_state)
                N_n_0_188_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_188", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_189_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_189_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_189_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_189_0_sig_outs_0 = 0
function N_m_n_0_189_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_189_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_189_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_187_0_rcvs_0(m) {
                            
                IO_snd_n_0_187_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_187_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_185_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_185_state, G_msg_readFloatToken(m, 0))
                        N_n_0_186_rcvs_1(G_msg_floats([N_n_0_185_state.leftOp + N_n_0_185_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_186_rcvs_1(G_msg_floats([N_n_0_185_state.leftOp + N_n_0_185_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_185", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_191_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_191_state.msgSpecs.splice(0, N_n_0_191_state.msgSpecs.length - 1)
                    N_n_0_191_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_191_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_191_state.msgSpecs.length; i++) {
                        if (N_n_0_191_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_191_state.msgSpecs[i].send, N_n_0_191_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_191_snds_0(N_n_0_191_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_191", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_190_outs_0 = 0
function N_n_0_190_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_190_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_190_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_190_state)
                return
    
            }
        
                            throw new Error('Node "n_0_190", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_191_0_rcvs_0(m) {
                            
                IO_snd_n_0_191_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_191_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_193_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_193_state, 
                            () => N_n_0_192_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_193_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_193_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_193_state,
                        () => N_n_0_192_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_193_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_193", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_192_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_192_state.msgSpecs.splice(0, N_n_0_192_state.msgSpecs.length - 1)
                    N_n_0_192_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_192_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_192_state.msgSpecs.length; i++) {
                        if (N_n_0_192_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_192_state.msgSpecs[i].send, N_n_0_192_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_192_snds_0(N_n_0_192_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_192", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_192_0_rcvs_0(m) {
                            
                IO_snd_n_0_192_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_192_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_197_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_198_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_197_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_197", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_198_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_0_198_state, G_msg_readFloatToken(m, 0))
                        N_n_0_199_rcvs_0(G_msg_floats([N_n_0_198_state.rightOp !== 0 ? N_n_0_198_state.leftOp / N_n_0_198_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_199_rcvs_0(G_msg_floats([N_n_0_198_state.rightOp !== 0 ? N_n_0_198_state.leftOp / N_n_0_198_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_0_198", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_199_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_199_state.msgSpecs.splice(0, N_n_0_199_state.msgSpecs.length - 1)
                    N_n_0_199_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_199_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_199_state.msgSpecs.length; i++) {
                        if (N_n_0_199_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_199_state.msgSpecs[i].send, N_n_0_199_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_199_snds_0(N_n_0_199_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_199", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_200_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_200_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_200_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_200_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_200_state.nextDurationSamp === 0) {
                            N_n_0_200_state.currentValue = targetValue
                            N_n_0_200_snds_0(G_msg_floats([targetValue]))
                        } else {
                            N_n_0_200_snds_0(G_msg_floats([N_n_0_200_state.currentValue]))
                            NT_line_setNewLine(N_n_0_200_state, targetValue)
                            NT_line_incrementTime(N_n_0_200_state, N_n_0_200_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_200_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_200_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_200_state)
                N_n_0_200_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_200", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_203_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_203_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_203_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_203_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_203_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_203_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_2_rcvs_0(m) {
                            
            N_n_0_202_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_12_3_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_12_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_12_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_202_rcvs_0(G_msg_floats([N_n_12_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_202_rcvs_0(G_msg_floats([N_n_12_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_12_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_202_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_202_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_204_1__routemsg_rcvs_0(G_msg_floats([N_n_0_202_state.leftOp - N_n_0_202_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_204_1__routemsg_rcvs_0(G_msg_floats([N_n_0_202_state.leftOp - N_n_0_202_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_202", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_202_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_sub_setRight(N_n_0_202_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_202", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_204_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_204_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_204_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_204_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_204_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_204_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_199_0_rcvs_0(m) {
                            
                IO_snd_n_0_199_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_199_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_11_0_rcvs_0(m) {
                            
                IO_snd_n_0_11_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_11_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_19_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_19_state.msgSpecs.splice(0, N_n_0_19_state.msgSpecs.length - 1)
                    N_n_0_19_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_19_state.msgSpecs.length; i++) {
                        if (N_n_0_19_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_19_state.msgSpecs[i].send, N_n_0_19_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_19_snds_0(N_n_0_19_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_20_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_20_state, m)
                return
            
                            throw new Error('Node "n_0_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_31_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                const newValue = G_msg_readFloatToken(m, 0)
                if (newValue !== N_n_0_31_state.currentValue) {
                    N_n_0_31_state.currentValue = newValue
                    N_n_0_32_rcvs_0(G_msg_floats([N_n_0_31_state.currentValue]))
                }
                return
    
            } else if (G_bangUtils_isBang(m)) {
                N_n_0_32_rcvs_0(G_msg_floats([N_n_0_31_state.currentValue]))
                return 
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                N_n_0_31_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_31", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_32_rcvs_0(m) {
                            
            N_n_0_35_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_20_0_rcvs_0(m) {
                            
                IO_snd_n_0_20_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_20_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_19_0_rcvs_0(m) {
                            
                IO_snd_n_0_19_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_19_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_22_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_22_state.msgSpecs.splice(0, N_n_0_22_state.msgSpecs.length - 1)
                    N_n_0_22_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_22_state.msgSpecs.length; i++) {
                        if (N_n_0_22_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_22_state.msgSpecs[i].send, N_n_0_22_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_22_snds_0(N_n_0_22_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_23_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_23_state, m)
                return
            
                            throw new Error('Node "n_0_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_149_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_149_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_149_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_149_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_149_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_149_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_169_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_169_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_169_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_169_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_169_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_169_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_195_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_195_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_195_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_195_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_195_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_195_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_315_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_315_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_315_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_315_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_315_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_315_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_316_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_316_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_316_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_316_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_316_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_316_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_23_0_rcvs_0(m) {
                            
                IO_snd_n_0_23_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_23_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_22_0_rcvs_0(m) {
                            
                IO_snd_n_0_22_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_22_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_25_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_25_state.msgSpecs.splice(0, N_n_0_25_state.msgSpecs.length - 1)
                    N_n_0_25_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_25_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_25_state.msgSpecs.length; i++) {
                        if (N_n_0_25_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_25_state.msgSpecs[i].send, N_n_0_25_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_25_snds_0(N_n_0_25_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_26_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_26_state, m)
                return
            
                            throw new Error('Node "n_0_26", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_73_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_73_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_73_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_73_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_73_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_73_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_26_0_rcvs_0(m) {
                            
                IO_snd_n_0_26_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_26_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_25_0_rcvs_0(m) {
                            
                IO_snd_n_0_25_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_25_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_28_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_28_state.msgSpecs.splice(0, N_n_0_28_state.msgSpecs.length - 1)
                    N_n_0_28_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_28_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_28_state.msgSpecs.length; i++) {
                        if (N_n_0_28_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_28_state.msgSpecs[i].send, N_n_0_28_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_28_snds_0(N_n_0_28_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_29_rcvs_0(m) {
                            
                NT_hsl_receiveMessage(N_n_0_29_state, m)
                return
            
                            throw new Error('Node "n_0_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_344_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_344_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_344_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_344_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_344_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_344_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_345_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_345_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_345_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_345_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_345_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_345_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_29_0_rcvs_0(m) {
                            
                IO_snd_n_0_29_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_29_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_28_0_rcvs_0(m) {
                            
                IO_snd_n_0_28_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_28_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_ioSnd_n_0_8_0_rcvs_0(m) {
                            
                IO_snd_n_0_8_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_8_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_ioSnd_n_0_21_0_rcvs_0(m) {
                            
                IO_snd_n_0_21_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_21_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_ioSnd_n_0_24_0_rcvs_0(m) {
                            
                IO_snd_n_0_24_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_24_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_ioSnd_n_0_27_0_rcvs_0(m) {
                            
                IO_snd_n_0_27_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_27_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_ioSnd_n_0_30_0_rcvs_0(m) {
                            
                IO_snd_n_0_30_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_30_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_283_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_0_283_state, 
                            () => N_n_0_283_snds_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_0_283_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_0_283_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_0_283_state,
                        () => N_n_0_283_snds_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_283_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_283", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_284_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_284_state.msgSpecs.splice(0, N_n_0_284_state.msgSpecs.length - 1)
                    N_n_0_284_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_284_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_284_state.msgSpecs.length; i++) {
                        if (N_n_0_284_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_284_state.msgSpecs[i].send, N_n_0_284_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_284_snds_0(N_n_0_284_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_284", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_288_rcvs_0(m) {
                            
            if (
                G_msg_getLength(m) >= 3 
                && G_msg_isStringToken(m, 0)
                && (
                    G_msg_readStringToken(m, 0) === 'read'
                    || G_msg_readStringToken(m, 0) === 'write'
                )
            ) {
                const operationType = G_msg_readStringToken(m, 0)
                const soundInfo = {
                    channelCount: 0,
                    sampleRate: toInt(SAMPLE_RATE),
                    bitDepth: 32,
                    encodingFormat: '',
                    endianness: '',
                    extraOptions: '',
                }
                const operation = {
                    arrayNames: [],
                    resize: false,
                    maxSize: -1,
                    skip: 0,
                    framesToWrite: 0,
                    url: '',
                    soundInfo,
                }
                let unhandledOptions = G_soundFileOpenOpts_parse(
                    m,
                    soundInfo,
                )
                
                // Remove the operation type
                unhandledOptions.delete(0)
                
                let i = 1
                let str = ""
                while (i < G_msg_getLength(m)) {
                    if (!unhandledOptions.has(i)) {

                    } else if (G_msg_isStringToken(m, i)) {
                        str = G_msg_readStringToken(m, i)
                        if (str === '-resize') {
                            unhandledOptions.delete(i)
                            operation.resize = true

                        } else if (str === '-maxsize' || str === '-nframes') {
                            unhandledOptions.delete(i)
                            if (
                                i + 1 >= G_msg_getLength(m) 
                                || !G_msg_isFloatToken(m, i + 1)
                            ) {
                                console.log("invalid value for -maxsize")
                            }
                            operation.maxSize = G_msg_readFloatToken(m, i + 1)
                            unhandledOptions.delete(i + 1)
                            i++

                        } else if (str === '-skip') {
                            unhandledOptions.delete(i)
                            if (
                                i + 1 >= G_msg_getLength(m) 
                                || !G_msg_isFloatToken(m, i + 1)
                            ) {
                                console.log("invalid value for -skip")
                            }
                            operation.skip = G_msg_readFloatToken(m, i + 1)
                            unhandledOptions.delete(i + 1)
                            i++

                        } else if (str === '-normalize') {
                            unhandledOptions.delete(i)
                            console.log('-normalize not implemented')
                        }
                    }
                    i++
                }

                i = 1
                let urlFound = false
                while (i < G_msg_getLength(m)) {
                    if (!unhandledOptions.has(i)) {

                    } else if (G_msg_isStringToken(m, i)) {
                        str = G_msg_readStringToken(m, i)
                        if (!str.startsWith('-') && urlFound === false) {
                            operation.url = str
                            urlFound = true
                        } else {
                            operation.arrayNames.push(str)
                        }
                        unhandledOptions.delete(i)
                    }
                    i++
                }

                for (i = 0; i < operation.arrayNames.length; i++) {
                    if (!G_commons_hasArray(operation.arrayNames[i])) {
                        console.log('[soundfiler] unknown array ' + operation.arrayNames[i])
                        return
                    }
                }

                if (unhandledOptions.size) {
                    console.log("soundfiler received invalid options")
                }

                soundInfo.channelCount = operation.arrayNames.length

                if (operationType === 'read') {
                    const id = G_fs_readSoundFile(
                        operation.url, 
                        soundInfo,
                        function (id, status, sound) {
                            const operation = N_n_0_288_state.operations.get(id)
                            N_n_0_288_state.operations.delete(id)
                            let i = 0
                            let maxFramesRead = 0
                            let framesToRead = 0
                            let array = createFloatArray(0)
                            for (i = 0; i < sound.length; i++) {
                                if (operation.resize) {
                                    if (operation.maxSize > 0) {
                                        framesToRead = Math.min(
                                            operation.maxSize, 
                                            toFloat(sound[i].length) - operation.skip
                                        )
        
                                    } else {
                                        framesToRead = toFloat(sound[i].length) - operation.skip
                                    }
        
                                    G_commons_setArray(
                                        operation.arrayNames[i], 
                                        sound[i].subarray(
                                            toInt(operation.skip), 
                                            toInt(operation.skip + framesToRead)
                                        )
                                    )
                                    
                                } else {
                                    array = G_commons_getArray(operation.arrayNames[i])
                                    framesToRead = Math.min(
                                        toFloat(array.length),
                                        toFloat(sound[i].length) - operation.skip
                                    )
                                    array.set(sound[i].subarray(0, array.length))
                                }
                                maxFramesRead = Math.max(
                                    maxFramesRead,
                                    framesToRead
                                )
                            }
        
                            G_msg_VOID_MESSAGE_RECEIVER(NT_soundfiler_buildMessage1(operation.soundInfo))
                            G_msg_VOID_MESSAGE_RECEIVER(G_msg_floats([maxFramesRead]))
                        }
                    )

                    N_n_0_288_state.operations.set(id, operation)

                } else if (operationType === 'write') {
                    let i = 0
                    let framesToWrite = 0
                    let array = createFloatArray(0)
                    const sound = []
                    
                    for (i = 0; i < operation.arrayNames.length; i++) {
                        framesToWrite = Math.max(
                            framesToWrite,
                            toFloat(G_commons_getArray(operation.arrayNames[i]).length) - operation.skip,
                        )
                    }

                    if (operation.maxSize >= 0) {
                        framesToWrite = Math.min(
                            operation.maxSize, 
                            framesToWrite
                        )
                    }
                    operation.framesToWrite = framesToWrite

                    if (framesToWrite < 1) {
                        console.log('[soundfiler] no frames to write')
                        return
                    }

                    for (i = 0; i < operation.arrayNames.length; i++) {
                        array = G_commons_getArray(operation.arrayNames[i])
                        if (framesToWrite > toFloat(array.length) - operation.skip) {
                            sound.push(createFloatArray(toInt(framesToWrite)))
                            sound[i].set(array.subarray(
                                toInt(operation.skip), 
                                toInt(operation.skip + framesToWrite)
                            ))
                        } else {
                            sound.push(array.subarray(
                                toInt(operation.skip), 
                                toInt(operation.skip + framesToWrite)
                            ))
                        }
                    }

                    function callback(id, status) {
                        const operation = N_n_0_288_state.operations.get(id)
                        N_n_0_288_state.operations.delete(id)
                        G_msg_VOID_MESSAGE_RECEIVER(NT_soundfiler_buildMessage1(operation.soundInfo))
                        G_msg_VOID_MESSAGE_RECEIVER(G_msg_floats([operation.framesToWrite]))
                    }

                    const id = G_fs_writeSoundFile(
                        sound, 
                        operation.url, 
                        soundInfo, 
                        callback
                    )

                    N_n_0_288_state.operations.set(id, operation)
                }

                return
            }
        
                            throw new Error('Node "n_0_288", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_284_0_rcvs_0(m) {
                            
                IO_snd_n_0_284_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_284_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_285_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_285_state.msgSpecs.splice(0, N_n_0_285_state.msgSpecs.length - 1)
                    N_n_0_285_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_285_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_285_state.msgSpecs.length; i++) {
                        if (N_n_0_285_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_285_state.msgSpecs[i].send, N_n_0_285_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_285_snds_0(N_n_0_285_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_285", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_285_0_rcvs_0(m) {
                            
                IO_snd_n_0_285_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_285_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_286_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_286_state.msgSpecs.splice(0, N_n_0_286_state.msgSpecs.length - 1)
                    N_n_0_286_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_286_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_286_state.msgSpecs.length; i++) {
                        if (N_n_0_286_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_286_state.msgSpecs[i].send, N_n_0_286_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_286_snds_0(N_n_0_286_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_286", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_286_0_rcvs_0(m) {
                            
                IO_snd_n_0_286_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_286_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_287_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_0_287_state.msgSpecs.splice(0, N_n_0_287_state.msgSpecs.length - 1)
                    N_n_0_287_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_0_287_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_0_287_state.msgSpecs.length; i++) {
                        if (N_n_0_287_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_0_287_state.msgSpecs[i].send, N_n_0_287_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_0_287_snds_0(N_n_0_287_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_0_287", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_287_0_rcvs_0(m) {
                            
                IO_snd_n_0_287_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_287_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }




















































































































































let N_n_0_60_outs_0 = 0

let N_n_0_61_outs_0 = 0







let N_n_0_70_outs_0 = 0

let N_m_n_0_72_0_sig_outs_0 = 0

let N_n_0_72_outs_0 = 0



let N_n_0_228_outs_0 = 0

let N_n_0_230_outs_0 = 0











let N_n_0_239_outs_0 = 0













let N_n_0_76_outs_0 = 0



let N_n_0_95_outs_0 = 0

let N_n_0_102_outs_0 = 0



let N_n_0_109_outs_0 = 0





let N_m_n_0_119_1_sig_outs_0 = 0

let N_n_0_119_outs_0 = 0



let N_n_0_120_outs_0 = 0









let N_n_0_143_outs_0 = 0





let N_n_0_150_outs_0 = 0







let N_n_0_163_outs_0 = 0







let N_n_0_170_outs_0 = 0





let N_m_n_0_254_0_sig_outs_0 = 0

let N_n_0_254_outs_0 = 0





let N_n_0_256_outs_0 = 0





let N_n_0_264_outs_0 = 0





let N_n_0_266_outs_0 = 0





let N_m_n_0_274_1_sig_outs_0 = 0

let N_n_0_274_outs_0 = 0





let N_n_0_276_outs_0 = 0



let N_n_0_189_outs_0 = 0







let N_n_0_196_outs_0 = 0









let N_n_0_130_outs_0 = 0

let N_m_n_0_131_1_sig_outs_0 = 0

let N_n_0_131_outs_0 = 0





let N_n_0_138_outs_0 = 0







let N_n_0_39_outs_0 = 0





let N_n_0_45_outs_0 = 0

























































































































function N_n_0_5_snds_0(m) {
                        N_n_0_6_rcvs_0(m)
N_n_0_11_rcvs_0(m)
N_n_0_19_rcvs_0(m)
N_n_0_22_rcvs_0(m)
N_n_0_25_rcvs_0(m)
N_n_0_28_rcvs_0(m)
                    }
function N_n_0_6_snds_0(m) {
                        N_n_0_7_rcvs_0(m)
N_n_ioSnd_n_0_6_0_rcvs_0(m)
                    }
function N_n_0_7_snds_0(m) {
                        N_n_0_33_rcvs_0(m)
N_n_9_2_rcvs_0(m)
N_n_ioSnd_n_0_7_0_rcvs_0(m)
                    }
function N_n_0_35_snds_0(m) {
                        N_n_0_36_rcvs_0(m)
N_n_0_41_rcvs_0(m)
N_n_0_43_rcvs_0(m)
                    }
function N_m_n_0_39_0__routemsg_snds_0(m) {
                        N_m_n_0_39_0_sig_rcvs_0(m)
COLD_16(m)
                    }
function N_n_0_41_snds_0(m) {
                        N_n_0_40_rcvs_0(m)
N_n_ioSnd_n_0_41_0_rcvs_0(m)
                    }
function N_n_0_42_snds_0(m) {
                        N_n_0_40_rcvs_0(m)
N_n_ioSnd_n_0_42_0_rcvs_0(m)
                    }
function N_n_0_14_snds_0(m) {
                        N_n_0_13_rcvs_1(m)
N_n_0_15_rcvs_0(m)
N_n_0_16_rcvs_0(m)
N_n_0_205_rcvs_0(m)
                    }
function N_n_0_16_snds_0(m) {
                        N_n_0_49_rcvs_0(m)
N_n_0_88_rcvs_0(m)
N_n_0_124_rcvs_0(m)
N_n_0_248_rcvs_0(m)
N_n_0_257_rcvs_0(m)
N_n_0_267_rcvs_0(m)
N_n_0_289_rcvs_0(m)
N_n_0_290_rcvs_0(m)
N_n_0_291_rcvs_0(m)
N_n_0_292_rcvs_0(m)
                    }
function N_n_0_49_snds_0(m) {
                        N_n_0_50_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_1(m) {
                        N_n_0_52_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_2(m) {
                        N_n_0_54_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_3(m) {
                        N_n_0_53_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_4(m) {
                        N_n_0_52_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_5(m) {
                        N_n_0_50_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_6(m) {
                        N_n_0_51_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_7(m) {
                        N_n_0_53_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_8(m) {
                        N_n_0_55_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_9(m) {
                        N_n_0_54_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_10(m) {
                        N_n_0_53_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_11(m) {
                        N_n_0_51_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_12(m) {
                        N_n_0_52_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_13(m) {
                        N_n_0_54_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_14(m) {
                        N_n_0_56_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_15(m) {
                        N_n_0_55_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_16(m) {
                        N_n_0_54_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_17(m) {
                        N_n_0_52_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_18(m) {
                        N_n_0_53_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_19(m) {
                        N_n_0_55_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_20(m) {
                        N_n_0_57_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_21(m) {
                        N_n_0_56_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_22(m) {
                        N_n_0_54_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_49_snds_23(m) {
                        N_n_0_52_rcvs_0(m)
N_n_0_65_rcvs_0(m)
N_n_0_77_rcvs_0(m)
                    }
function N_n_0_50_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_50_0_rcvs_0(m)
                    }
function N_n_0_59_snds_0(m) {
                        N_m_n_0_60_0__routemsg_rcvs_0(m)
N_n_0_62_rcvs_0(m)
                    }
function N_m_n_0_60_0__routemsg_snds_0(m) {
                        N_m_n_0_60_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_m_n_0_61_0__routemsg_snds_0(m) {
                        N_m_n_0_61_0_sig_rcvs_0(m)
COLD_1(m)
                    }
function N_n_0_65_snds_0(m) {
                        N_n_0_67_rcvs_0(m)
N_n_0_69_rcvs_0(m)
                    }
function N_n_0_67_snds_0(m) {
                        N_n_0_66_rcvs_0(m)
N_n_ioSnd_n_0_67_0_rcvs_0(m)
                    }
function N_n_0_68_snds_0(m) {
                        N_n_0_66_rcvs_0(m)
N_n_ioSnd_n_0_68_0_rcvs_0(m)
                    }
function N_n_0_77_snds_0(m) {
                        N_n_0_78_rcvs_0(m)
N_n_0_79_rcvs_0(m)
                    }
function N_n_0_80_snds_0(m) {
                        N_n_0_82_rcvs_0(m)
N_n_ioSnd_n_0_80_0_rcvs_0(m)
                    }
function N_n_0_82_snds_0(m) {
                        N_m_n_0_85_1__routemsg_rcvs_0(m)
N_n_10_2_rcvs_0(m)
                    }
function N_n_0_81_snds_0(m) {
                        N_n_0_82_rcvs_0(m)
N_n_ioSnd_n_0_81_0_rcvs_0(m)
                    }
function N_n_0_52_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_52_0_rcvs_0(m)
                    }
function N_n_0_54_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_54_0_rcvs_0(m)
                    }
function N_n_0_53_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_53_0_rcvs_0(m)
                    }
function N_n_0_51_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_51_0_rcvs_0(m)
                    }
function N_n_0_55_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_55_0_rcvs_0(m)
                    }
function N_n_0_56_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_56_0_rcvs_0(m)
                    }
function N_n_0_57_snds_0(m) {
                        N_n_0_58_rcvs_0(m)
N_n_ioSnd_n_0_57_0_rcvs_0(m)
                    }
function N_n_0_88_snds_0(m) {
                        N_n_0_89_rcvs_0(m)
N_n_0_96_rcvs_0(m)
N_n_0_103_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_1(m) {
                        N_n_0_90_rcvs_0(m)
N_n_0_97_rcvs_0(m)
N_n_0_104_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_2(m) {
                        N_n_0_89_rcvs_0(m)
N_n_0_96_rcvs_0(m)
N_n_0_103_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_3(m) {
                        N_n_0_90_rcvs_0(m)
N_n_0_97_rcvs_0(m)
N_n_0_104_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_4(m) {
                        N_n_0_89_rcvs_0(m)
N_n_0_96_rcvs_0(m)
N_n_0_103_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_5(m) {
                        N_n_0_90_rcvs_0(m)
N_n_0_97_rcvs_0(m)
N_n_0_104_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_6(m) {
                        N_n_0_91_rcvs_0(m)
N_n_0_98_rcvs_0(m)
N_n_0_105_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_88_snds_7(m) {
                        N_n_0_92_rcvs_0(m)
N_n_0_99_rcvs_0(m)
N_n_0_106_rcvs_0(m)
N_n_0_112_rcvs_0(m)
                    }
function N_n_0_89_snds_0(m) {
                        N_n_0_93_rcvs_0(m)
N_n_ioSnd_n_0_89_0_rcvs_0(m)
                    }
function N_m_n_0_95_0__routemsg_snds_0(m) {
                        N_m_n_0_95_0_sig_rcvs_0(m)
COLD_5(m)
                    }
function N_n_0_96_snds_0(m) {
                        N_n_0_100_rcvs_0(m)
N_n_ioSnd_n_0_96_0_rcvs_0(m)
                    }
function N_m_n_0_102_0__routemsg_snds_0(m) {
                        N_m_n_0_102_0_sig_rcvs_0(m)
COLD_6(m)
                    }
function N_n_0_103_snds_0(m) {
                        N_n_0_107_rcvs_0(m)
N_n_ioSnd_n_0_103_0_rcvs_0(m)
                    }
function N_m_n_0_109_0__routemsg_snds_0(m) {
                        N_m_n_0_109_0_sig_rcvs_0(m)
COLD_7(m)
                    }
function N_n_0_112_snds_0(m) {
                        N_n_0_115_rcvs_0(m)
N_n_0_117_rcvs_0(m)
                    }
function N_n_0_114_snds_0(m) {
                        N_n_0_113_rcvs_0(m)
N_n_ioSnd_n_0_114_0_rcvs_0(m)
                    }
function N_n_0_116_snds_0(m) {
                        N_n_0_113_rcvs_0(m)
N_n_ioSnd_n_0_116_0_rcvs_0(m)
                    }
function N_n_0_90_snds_0(m) {
                        N_n_0_93_rcvs_0(m)
N_n_ioSnd_n_0_90_0_rcvs_0(m)
                    }
function N_n_0_97_snds_0(m) {
                        N_n_0_100_rcvs_0(m)
N_n_ioSnd_n_0_97_0_rcvs_0(m)
                    }
function N_n_0_104_snds_0(m) {
                        N_n_0_107_rcvs_0(m)
N_n_ioSnd_n_0_104_0_rcvs_0(m)
                    }
function N_n_0_91_snds_0(m) {
                        N_n_0_93_rcvs_0(m)
N_n_ioSnd_n_0_91_0_rcvs_0(m)
                    }
function N_n_0_98_snds_0(m) {
                        N_n_0_100_rcvs_0(m)
N_n_ioSnd_n_0_98_0_rcvs_0(m)
                    }
function N_n_0_105_snds_0(m) {
                        N_n_0_107_rcvs_0(m)
N_n_ioSnd_n_0_105_0_rcvs_0(m)
                    }
function N_n_0_92_snds_0(m) {
                        N_n_0_93_rcvs_0(m)
N_n_ioSnd_n_0_92_0_rcvs_0(m)
                    }
function N_n_0_99_snds_0(m) {
                        N_n_0_100_rcvs_0(m)
N_n_ioSnd_n_0_99_0_rcvs_0(m)
                    }
function N_n_0_106_snds_0(m) {
                        N_n_0_107_rcvs_0(m)
N_n_ioSnd_n_0_106_0_rcvs_0(m)
                    }
function N_n_0_124_snds_0(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_1(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_2(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_3(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_4(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_5(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_6(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_7(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_8(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_9(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_10(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_11(m) {
                        N_n_0_125_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_12(m) {
                        N_n_0_126_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_13(m) {
                        N_n_0_126_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_14(m) {
                        N_n_0_127_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_124_snds_15(m) {
                        N_n_0_127_rcvs_0(m)
N_n_0_132_rcvs_0(m)
                    }
function N_n_0_125_snds_0(m) {
                        N_n_0_128_rcvs_0(m)
N_n_ioSnd_n_0_125_0_rcvs_0(m)
                    }
function N_m_n_0_130_0__routemsg_snds_0(m) {
                        N_m_n_0_130_0_sig_rcvs_0(m)
COLD_14(m)
                    }
function N_n_0_132_snds_0(m) {
                        N_n_0_134_rcvs_0(m)
N_n_0_136_rcvs_0(m)
                    }
function N_n_0_134_snds_0(m) {
                        N_n_0_133_rcvs_0(m)
N_n_ioSnd_n_0_134_0_rcvs_0(m)
                    }
function N_n_0_135_snds_0(m) {
                        N_n_0_133_rcvs_0(m)
N_n_ioSnd_n_0_135_0_rcvs_0(m)
                    }
function N_n_0_126_snds_0(m) {
                        N_n_0_128_rcvs_0(m)
N_n_ioSnd_n_0_126_0_rcvs_0(m)
                    }
function N_n_0_127_snds_0(m) {
                        N_n_0_128_rcvs_0(m)
N_n_ioSnd_n_0_127_0_rcvs_0(m)
                    }
function N_n_0_249_snds_0(m) {
                        N_n_0_251_rcvs_0(m)
N_n_0_253_rcvs_0(m)
                    }
function N_n_0_251_snds_0(m) {
                        N_n_0_250_rcvs_0(m)
N_n_ioSnd_n_0_251_0_rcvs_0(m)
                    }
function N_n_0_252_snds_0(m) {
                        N_n_0_250_rcvs_0(m)
N_n_ioSnd_n_0_252_0_rcvs_0(m)
                    }
function N_n_0_258_snds_0(m) {
                        N_n_0_260_rcvs_0(m)
N_n_0_262_rcvs_0(m)
                    }
function N_n_0_260_snds_0(m) {
                        N_n_0_259_rcvs_0(m)
N_n_ioSnd_n_0_260_0_rcvs_0(m)
                    }
function N_n_0_261_snds_0(m) {
                        N_n_0_259_rcvs_0(m)
N_n_ioSnd_n_0_261_0_rcvs_0(m)
                    }
function N_n_0_268_snds_0(m) {
                        N_n_0_270_rcvs_0(m)
N_n_0_272_rcvs_0(m)
                    }
function N_n_0_270_snds_0(m) {
                        N_n_0_269_rcvs_0(m)
N_n_ioSnd_n_0_270_0_rcvs_0(m)
                    }
function N_n_0_271_snds_0(m) {
                        N_n_0_269_rcvs_0(m)
N_n_ioSnd_n_0_271_0_rcvs_0(m)
                    }
function N_n_0_207_snds_0(m) {
                        N_n_0_208_rcvs_0(m)
N_n_0_209_rcvs_0(m)
                    }
function N_n_0_209_snds_0(m) {
                        N_n_0_210_rcvs_0(m)
N_n_0_220_rcvs_0(m)
N_n_0_233_rcvs_0(m)
N_n_0_240_rcvs_0(m)
                    }
function N_n_0_209_snds_1(m) {
                        N_n_0_215_rcvs_0(m)
N_n_0_225_rcvs_0(m)
N_n_0_233_rcvs_0(m)
N_n_0_241_rcvs_0(m)
                    }
function N_n_0_210_snds_0(m) {
                        N_n_0_211_rcvs_0(m)
N_n_0_221_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_211_snds_0(m) {
                        N_n_0_212_rcvs_0(m)
N_n_0_222_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_212_snds_0(m) {
                        N_n_0_213_rcvs_0(m)
N_n_0_223_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_213_snds_0(m) {
                        N_n_0_214_rcvs_0(m)
N_n_0_224_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_214_snds_0(m) {
                        N_n_0_225_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_225_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_225_0_rcvs_0(m)
                    }
function N_n_0_227_snds_0(m) {
                        N_m_n_0_228_0__routemsg_rcvs_0(m)
N_n_0_229_rcvs_0(m)
                    }
function N_m_n_0_228_0__routemsg_snds_0(m) {
                        N_m_n_0_228_0_sig_rcvs_0(m)
COLD_3(m)
                    }
function N_m_n_0_230_0__routemsg_snds_0(m) {
                        N_m_n_0_230_0_sig_rcvs_0(m)
COLD_4(m)
                    }
function N_n_0_233_snds_0(m) {
                        N_n_0_235_rcvs_0(m)
N_n_0_237_rcvs_0(m)
                    }
function N_n_0_235_snds_0(m) {
                        N_n_0_234_rcvs_0(m)
N_n_ioSnd_n_0_235_0_rcvs_0(m)
                    }
function N_n_0_236_snds_0(m) {
                        N_n_0_234_rcvs_0(m)
N_n_ioSnd_n_0_236_0_rcvs_0(m)
                    }
function N_n_0_224_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_224_0_rcvs_0(m)
                    }
function N_n_0_223_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_223_0_rcvs_0(m)
                    }
function N_n_0_222_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_222_0_rcvs_0(m)
                    }
function N_n_0_221_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_221_0_rcvs_0(m)
                    }
function N_n_0_220_snds_0(m) {
                        N_n_0_226_rcvs_0(m)
N_n_ioSnd_n_0_220_0_rcvs_0(m)
                    }
function N_n_0_240_snds_0(m) {
                        N_n_0_242_rcvs_0(m)
N_n_ioSnd_n_0_240_0_rcvs_0(m)
                    }
function N_n_0_242_snds_0(m) {
                        N_m_n_0_245_1__routemsg_rcvs_0(m)
N_n_13_2_rcvs_0(m)
                    }
function N_n_0_215_snds_0(m) {
                        N_n_0_216_rcvs_0(m)
N_n_0_224_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_216_snds_0(m) {
                        N_n_0_217_rcvs_0(m)
N_n_0_223_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_217_snds_0(m) {
                        N_n_0_218_rcvs_0(m)
N_n_0_222_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_218_snds_0(m) {
                        N_n_0_219_rcvs_0(m)
N_n_0_221_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_219_snds_0(m) {
                        N_n_0_220_rcvs_0(m)
N_n_0_233_rcvs_0(m)
                    }
function N_n_0_241_snds_0(m) {
                        N_n_0_242_rcvs_0(m)
N_n_ioSnd_n_0_241_0_rcvs_0(m)
                    }
function N_n_0_11_snds_0(m) {
                        N_n_0_12_rcvs_0(m)
N_n_0_144_rcvs_0(m)
N_n_0_153_rcvs_0(m)
N_n_0_179_rcvs_0(m)
N_n_ioSnd_n_0_11_0_rcvs_0(m)
                    }
function N_n_0_147_snds_0(m) {
                        N_n_0_148_rcvs_0(m)
N_n_ioSnd_n_0_147_0_rcvs_0(m)
                    }
function N_m_n_0_143_1__routemsg_snds_0(m) {
                        N_m_n_0_143_1_sig_rcvs_0(m)
COLD_9(m)
                    }
function N_n_0_155_snds_0(m) {
                        N_n_0_156_rcvs_0(m)
N_n_0_165_rcvs_0(m)
N_n_0_167_rcvs_0(m)
N_n_0_171_rcvs_0(m)
                    }
function N_n_0_161_snds_0(m) {
                        N_n_0_162_rcvs_0(m)
N_n_ioSnd_n_0_161_0_rcvs_0(m)
                    }
function N_m_n_0_163_0__routemsg_snds_0(m) {
                        N_m_n_0_163_0_sig_rcvs_0(m)
COLD_10(m)
                    }
function N_n_0_165_snds_0(m) {
                        N_n_0_164_rcvs_0(m)
N_n_ioSnd_n_0_165_0_rcvs_0(m)
                    }
function N_n_0_166_snds_0(m) {
                        N_n_0_164_rcvs_0(m)
N_n_ioSnd_n_0_166_0_rcvs_0(m)
                    }
function N_n_0_173_snds_0(m) {
                        N_n_0_174_rcvs_0(m)
N_n_ioSnd_n_0_173_0_rcvs_0(m)
                    }
function N_n_0_174_snds_0(m) {
                        N_m_n_0_177_1__routemsg_rcvs_0(m)
N_n_11_2_rcvs_0(m)
                    }
function N_n_0_181_snds_0(m) {
                        N_n_0_182_rcvs_0(m)
N_n_0_191_rcvs_0(m)
N_n_0_193_rcvs_0(m)
N_n_0_197_rcvs_0(m)
                    }
function N_n_0_187_snds_0(m) {
                        N_n_0_188_rcvs_0(m)
N_n_ioSnd_n_0_187_0_rcvs_0(m)
                    }
function N_m_n_0_189_0__routemsg_snds_0(m) {
                        N_m_n_0_189_0_sig_rcvs_0(m)
COLD_13(m)
                    }
function N_n_0_191_snds_0(m) {
                        N_n_0_190_rcvs_0(m)
N_n_ioSnd_n_0_191_0_rcvs_0(m)
                    }
function N_n_0_192_snds_0(m) {
                        N_n_0_190_rcvs_0(m)
N_n_ioSnd_n_0_192_0_rcvs_0(m)
                    }
function N_n_0_199_snds_0(m) {
                        N_n_0_200_rcvs_0(m)
N_n_ioSnd_n_0_199_0_rcvs_0(m)
                    }
function N_n_0_200_snds_0(m) {
                        N_m_n_0_203_1__routemsg_rcvs_0(m)
N_n_12_2_rcvs_0(m)
                    }
function N_n_0_19_snds_0(m) {
                        N_n_0_20_rcvs_0(m)
N_n_ioSnd_n_0_19_0_rcvs_0(m)
                    }
function N_n_0_20_snds_0(m) {
                        N_n_0_31_rcvs_0(m)
N_n_0_58_rcvs_1(m)
N_n_0_93_rcvs_1(m)
N_n_0_100_rcvs_1(m)
N_n_0_107_rcvs_1(m)
N_n_0_128_rcvs_1(m)
N_n_0_226_rcvs_1(m)
N_n_ioSnd_n_0_20_0_rcvs_0(m)
                    }
function N_n_0_22_snds_0(m) {
                        N_n_0_23_rcvs_0(m)
N_n_ioSnd_n_0_22_0_rcvs_0(m)
                    }
function N_n_0_23_snds_0(m) {
                        N_m_n_0_149_1__routemsg_rcvs_0(m)
N_m_n_0_169_1__routemsg_rcvs_0(m)
N_m_n_0_195_1__routemsg_rcvs_0(m)
N_m_n_0_315_1__routemsg_rcvs_0(m)
N_m_n_0_316_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_23_0_rcvs_0(m)
                    }
function N_n_0_25_snds_0(m) {
                        N_n_0_26_rcvs_0(m)
N_n_ioSnd_n_0_25_0_rcvs_0(m)
                    }
function N_n_0_26_snds_0(m) {
                        N_m_n_0_73_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_26_0_rcvs_0(m)
                    }
function N_n_0_28_snds_0(m) {
                        N_n_0_29_rcvs_0(m)
N_n_ioSnd_n_0_28_0_rcvs_0(m)
                    }
function N_n_0_29_snds_0(m) {
                        N_m_n_0_344_1__routemsg_rcvs_0(m)
N_m_n_0_345_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_29_0_rcvs_0(m)
                    }
function N_n_0_8_snds_0(m) {
                        N_n_0_33_rcvs_0(m)
N_n_9_2_rcvs_0(m)
N_n_ioSnd_n_0_8_0_rcvs_0(m)
                    }
function N_n_0_21_snds_0(m) {
                        N_n_0_31_rcvs_0(m)
N_n_0_58_rcvs_1(m)
N_n_0_93_rcvs_1(m)
N_n_0_100_rcvs_1(m)
N_n_0_107_rcvs_1(m)
N_n_0_128_rcvs_1(m)
N_n_0_226_rcvs_1(m)
N_n_ioSnd_n_0_21_0_rcvs_0(m)
                    }
function N_n_0_24_snds_0(m) {
                        N_m_n_0_149_1__routemsg_rcvs_0(m)
N_m_n_0_169_1__routemsg_rcvs_0(m)
N_m_n_0_195_1__routemsg_rcvs_0(m)
N_m_n_0_315_1__routemsg_rcvs_0(m)
N_m_n_0_316_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_24_0_rcvs_0(m)
                    }
function N_n_0_27_snds_0(m) {
                        N_m_n_0_73_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_27_0_rcvs_0(m)
                    }
function N_n_0_30_snds_0(m) {
                        N_m_n_0_344_1__routemsg_rcvs_0(m)
N_m_n_0_345_1__routemsg_rcvs_0(m)
N_n_ioSnd_n_0_30_0_rcvs_0(m)
                    }
function N_n_0_283_snds_0(m) {
                        N_n_0_284_rcvs_0(m)
N_n_0_285_rcvs_0(m)
N_n_0_286_rcvs_0(m)
N_n_0_287_rcvs_0(m)
                    }
function N_n_0_284_snds_0(m) {
                        N_n_0_288_rcvs_0(m)
N_n_ioSnd_n_0_284_0_rcvs_0(m)
                    }
function N_n_0_285_snds_0(m) {
                        N_n_0_288_rcvs_0(m)
N_n_ioSnd_n_0_285_0_rcvs_0(m)
                    }
function N_n_0_286_snds_0(m) {
                        N_n_0_288_rcvs_0(m)
N_n_ioSnd_n_0_286_0_rcvs_0(m)
                    }
function N_n_0_287_snds_0(m) {
                        N_n_0_288_rcvs_0(m)
N_n_ioSnd_n_0_287_0_rcvs_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_0_60_0_sig_outs_0 = N_m_n_0_60_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_60_state, N_m_n_0_60_0_sig_outs_0)
                }
function COLD_1(m) {
                    N_m_n_0_61_0_sig_outs_0 = N_m_n_0_61_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_61_state, N_m_n_0_61_0_sig_outs_0)
                }
function COLD_2(m) {
                    N_m_n_0_72_0_sig_outs_0 = N_m_n_0_72_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_0_72_state, N_m_n_0_72_0_sig_outs_0)
                }
function COLD_3(m) {
                    N_m_n_0_228_0_sig_outs_0 = N_m_n_0_228_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_228_state, N_m_n_0_228_0_sig_outs_0)
                }
function COLD_4(m) {
                    N_m_n_0_230_0_sig_outs_0 = N_m_n_0_230_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_230_state, N_m_n_0_230_0_sig_outs_0)
                }
function COLD_5(m) {
                    N_m_n_0_95_0_sig_outs_0 = N_m_n_0_95_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_95_state, N_m_n_0_95_0_sig_outs_0)
                }
function COLD_6(m) {
                    N_m_n_0_102_0_sig_outs_0 = N_m_n_0_102_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_102_state, N_m_n_0_102_0_sig_outs_0)
                }
function COLD_7(m) {
                    N_m_n_0_109_0_sig_outs_0 = N_m_n_0_109_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_109_state, N_m_n_0_109_0_sig_outs_0)
                }
function COLD_8(m) {
                    N_m_n_0_119_1_sig_outs_0 = N_m_n_0_119_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_0_119_state, N_m_n_0_119_1_sig_outs_0)
                }
function COLD_9(m) {
                    N_m_n_0_143_1_sig_outs_0 = N_m_n_0_143_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_0_143_state, N_m_n_0_143_1_sig_outs_0)
                }
function COLD_10(m) {
                    N_m_n_0_163_0_sig_outs_0 = N_m_n_0_163_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_163_state, N_m_n_0_163_0_sig_outs_0)
                }
function COLD_11(m) {
                    N_m_n_0_254_0_sig_outs_0 = N_m_n_0_254_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_254_state, N_m_n_0_254_0_sig_outs_0)
                }
function COLD_12(m) {
                    N_m_n_0_274_1_sig_outs_0 = N_m_n_0_274_1_sig_state.currentValue
                    
                N_n_0_274_state.coeff = Math.min(Math.max(1 - N_m_n_0_274_1_sig_outs_0 * (2 * Math.PI) / SAMPLE_RATE, 0), 1)
                N_n_0_274_state.normal = 0.5 * (1 + N_n_0_274_state.coeff)
            
                }
function COLD_13(m) {
                    N_m_n_0_189_0_sig_outs_0 = N_m_n_0_189_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_189_state, N_m_n_0_189_0_sig_outs_0)
                }
function COLD_14(m) {
                    N_m_n_0_130_0_sig_outs_0 = N_m_n_0_130_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_130_state, N_m_n_0_130_0_sig_outs_0)
                }
function COLD_15(m) {
                    N_m_n_0_131_1_sig_outs_0 = N_m_n_0_131_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_0_131_state, N_m_n_0_131_1_sig_outs_0)
                }
function COLD_16(m) {
                    N_m_n_0_39_0_sig_outs_0 = N_m_n_0_39_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_39_state, N_m_n_0_39_0_sig_outs_0)
                }
        function IO_rcv_n_0_6_0(m) {
                    N_n_0_6_rcvs_0(m)
                }
function IO_rcv_n_0_7_0(m) {
                    N_n_0_7_rcvs_0(m)
                }
function IO_rcv_n_0_11_0(m) {
                    N_n_0_11_rcvs_0(m)
                }
function IO_rcv_n_0_17_0(m) {
                    N_n_0_17_rcvs_0(m)
                }
function IO_rcv_n_0_19_0(m) {
                    N_n_0_19_rcvs_0(m)
                }
function IO_rcv_n_0_20_0(m) {
                    N_n_0_20_rcvs_0(m)
                }
function IO_rcv_n_0_22_0(m) {
                    N_n_0_22_rcvs_0(m)
                }
function IO_rcv_n_0_23_0(m) {
                    N_n_0_23_rcvs_0(m)
                }
function IO_rcv_n_0_25_0(m) {
                    N_n_0_25_rcvs_0(m)
                }
function IO_rcv_n_0_26_0(m) {
                    N_n_0_26_rcvs_0(m)
                }
function IO_rcv_n_0_28_0(m) {
                    N_n_0_28_rcvs_0(m)
                }
function IO_rcv_n_0_29_0(m) {
                    N_n_0_29_rcvs_0(m)
                }
function IO_rcv_n_0_41_0(m) {
                    N_n_0_41_rcvs_0(m)
                }
function IO_rcv_n_0_42_0(m) {
                    N_n_0_42_rcvs_0(m)
                }
function IO_rcv_n_0_50_0(m) {
                    N_n_0_50_rcvs_0(m)
                }
function IO_rcv_n_0_51_0(m) {
                    N_n_0_51_rcvs_0(m)
                }
function IO_rcv_n_0_52_0(m) {
                    N_n_0_52_rcvs_0(m)
                }
function IO_rcv_n_0_53_0(m) {
                    N_n_0_53_rcvs_0(m)
                }
function IO_rcv_n_0_54_0(m) {
                    N_n_0_54_rcvs_0(m)
                }
function IO_rcv_n_0_55_0(m) {
                    N_n_0_55_rcvs_0(m)
                }
function IO_rcv_n_0_56_0(m) {
                    N_n_0_56_rcvs_0(m)
                }
function IO_rcv_n_0_57_0(m) {
                    N_n_0_57_rcvs_0(m)
                }
function IO_rcv_n_0_67_0(m) {
                    N_n_0_67_rcvs_0(m)
                }
function IO_rcv_n_0_68_0(m) {
                    N_n_0_68_rcvs_0(m)
                }
function IO_rcv_n_0_80_0(m) {
                    N_n_0_80_rcvs_0(m)
                }
function IO_rcv_n_0_81_0(m) {
                    N_n_0_81_rcvs_0(m)
                }
function IO_rcv_n_0_89_0(m) {
                    N_n_0_89_rcvs_0(m)
                }
function IO_rcv_n_0_90_0(m) {
                    N_n_0_90_rcvs_0(m)
                }
function IO_rcv_n_0_91_0(m) {
                    N_n_0_91_rcvs_0(m)
                }
function IO_rcv_n_0_92_0(m) {
                    N_n_0_92_rcvs_0(m)
                }
function IO_rcv_n_0_96_0(m) {
                    N_n_0_96_rcvs_0(m)
                }
function IO_rcv_n_0_97_0(m) {
                    N_n_0_97_rcvs_0(m)
                }
function IO_rcv_n_0_98_0(m) {
                    N_n_0_98_rcvs_0(m)
                }
function IO_rcv_n_0_99_0(m) {
                    N_n_0_99_rcvs_0(m)
                }
function IO_rcv_n_0_103_0(m) {
                    N_n_0_103_rcvs_0(m)
                }
function IO_rcv_n_0_104_0(m) {
                    N_n_0_104_rcvs_0(m)
                }
function IO_rcv_n_0_105_0(m) {
                    N_n_0_105_rcvs_0(m)
                }
function IO_rcv_n_0_106_0(m) {
                    N_n_0_106_rcvs_0(m)
                }
function IO_rcv_n_0_114_0(m) {
                    N_n_0_114_rcvs_0(m)
                }
function IO_rcv_n_0_116_0(m) {
                    N_n_0_116_rcvs_0(m)
                }
function IO_rcv_n_0_125_0(m) {
                    N_n_0_125_rcvs_0(m)
                }
function IO_rcv_n_0_126_0(m) {
                    N_n_0_126_rcvs_0(m)
                }
function IO_rcv_n_0_127_0(m) {
                    N_n_0_127_rcvs_0(m)
                }
function IO_rcv_n_0_134_0(m) {
                    N_n_0_134_rcvs_0(m)
                }
function IO_rcv_n_0_135_0(m) {
                    N_n_0_135_rcvs_0(m)
                }
function IO_rcv_n_0_147_0(m) {
                    N_n_0_147_rcvs_0(m)
                }
function IO_rcv_n_0_161_0(m) {
                    N_n_0_161_rcvs_0(m)
                }
function IO_rcv_n_0_165_0(m) {
                    N_n_0_165_rcvs_0(m)
                }
function IO_rcv_n_0_166_0(m) {
                    N_n_0_166_rcvs_0(m)
                }
function IO_rcv_n_0_173_0(m) {
                    N_n_0_173_rcvs_0(m)
                }
function IO_rcv_n_0_187_0(m) {
                    N_n_0_187_rcvs_0(m)
                }
function IO_rcv_n_0_191_0(m) {
                    N_n_0_191_rcvs_0(m)
                }
function IO_rcv_n_0_192_0(m) {
                    N_n_0_192_rcvs_0(m)
                }
function IO_rcv_n_0_199_0(m) {
                    N_n_0_199_rcvs_0(m)
                }
function IO_rcv_n_0_220_0(m) {
                    N_n_0_220_rcvs_0(m)
                }
function IO_rcv_n_0_221_0(m) {
                    N_n_0_221_rcvs_0(m)
                }
function IO_rcv_n_0_222_0(m) {
                    N_n_0_222_rcvs_0(m)
                }
function IO_rcv_n_0_223_0(m) {
                    N_n_0_223_rcvs_0(m)
                }
function IO_rcv_n_0_224_0(m) {
                    N_n_0_224_rcvs_0(m)
                }
function IO_rcv_n_0_225_0(m) {
                    N_n_0_225_rcvs_0(m)
                }
function IO_rcv_n_0_235_0(m) {
                    N_n_0_235_rcvs_0(m)
                }
function IO_rcv_n_0_236_0(m) {
                    N_n_0_236_rcvs_0(m)
                }
function IO_rcv_n_0_240_0(m) {
                    N_n_0_240_rcvs_0(m)
                }
function IO_rcv_n_0_241_0(m) {
                    N_n_0_241_rcvs_0(m)
                }
function IO_rcv_n_0_251_0(m) {
                    N_n_0_251_rcvs_0(m)
                }
function IO_rcv_n_0_252_0(m) {
                    N_n_0_252_rcvs_0(m)
                }
function IO_rcv_n_0_260_0(m) {
                    N_n_0_260_rcvs_0(m)
                }
function IO_rcv_n_0_261_0(m) {
                    N_n_0_261_rcvs_0(m)
                }
function IO_rcv_n_0_270_0(m) {
                    N_n_0_270_rcvs_0(m)
                }
function IO_rcv_n_0_271_0(m) {
                    N_n_0_271_rcvs_0(m)
                }
function IO_rcv_n_0_284_0(m) {
                    N_n_0_284_rcvs_0(m)
                }
function IO_rcv_n_0_285_0(m) {
                    N_n_0_285_rcvs_0(m)
                }
function IO_rcv_n_0_286_0(m) {
                    N_n_0_286_rcvs_0(m)
                }
function IO_rcv_n_0_287_0(m) {
                    N_n_0_287_rcvs_0(m)
                }
        const IO_snd_n_0_6_0 = (m) => {exports.io.messageSenders['n_0_6']['0'](m)}
const IO_snd_n_0_7_0 = (m) => {exports.io.messageSenders['n_0_7']['0'](m)}
const IO_snd_n_0_11_0 = (m) => {exports.io.messageSenders['n_0_11']['0'](m)}
const IO_snd_n_0_17_0 = (m) => {exports.io.messageSenders['n_0_17']['0'](m)}
const IO_snd_n_0_19_0 = (m) => {exports.io.messageSenders['n_0_19']['0'](m)}
const IO_snd_n_0_20_0 = (m) => {exports.io.messageSenders['n_0_20']['0'](m)}
const IO_snd_n_0_22_0 = (m) => {exports.io.messageSenders['n_0_22']['0'](m)}
const IO_snd_n_0_23_0 = (m) => {exports.io.messageSenders['n_0_23']['0'](m)}
const IO_snd_n_0_25_0 = (m) => {exports.io.messageSenders['n_0_25']['0'](m)}
const IO_snd_n_0_26_0 = (m) => {exports.io.messageSenders['n_0_26']['0'](m)}
const IO_snd_n_0_28_0 = (m) => {exports.io.messageSenders['n_0_28']['0'](m)}
const IO_snd_n_0_29_0 = (m) => {exports.io.messageSenders['n_0_29']['0'](m)}
const IO_snd_n_0_41_0 = (m) => {exports.io.messageSenders['n_0_41']['0'](m)}
const IO_snd_n_0_42_0 = (m) => {exports.io.messageSenders['n_0_42']['0'](m)}
const IO_snd_n_0_50_0 = (m) => {exports.io.messageSenders['n_0_50']['0'](m)}
const IO_snd_n_0_51_0 = (m) => {exports.io.messageSenders['n_0_51']['0'](m)}
const IO_snd_n_0_52_0 = (m) => {exports.io.messageSenders['n_0_52']['0'](m)}
const IO_snd_n_0_53_0 = (m) => {exports.io.messageSenders['n_0_53']['0'](m)}
const IO_snd_n_0_54_0 = (m) => {exports.io.messageSenders['n_0_54']['0'](m)}
const IO_snd_n_0_55_0 = (m) => {exports.io.messageSenders['n_0_55']['0'](m)}
const IO_snd_n_0_56_0 = (m) => {exports.io.messageSenders['n_0_56']['0'](m)}
const IO_snd_n_0_57_0 = (m) => {exports.io.messageSenders['n_0_57']['0'](m)}
const IO_snd_n_0_67_0 = (m) => {exports.io.messageSenders['n_0_67']['0'](m)}
const IO_snd_n_0_68_0 = (m) => {exports.io.messageSenders['n_0_68']['0'](m)}
const IO_snd_n_0_80_0 = (m) => {exports.io.messageSenders['n_0_80']['0'](m)}
const IO_snd_n_0_81_0 = (m) => {exports.io.messageSenders['n_0_81']['0'](m)}
const IO_snd_n_0_89_0 = (m) => {exports.io.messageSenders['n_0_89']['0'](m)}
const IO_snd_n_0_90_0 = (m) => {exports.io.messageSenders['n_0_90']['0'](m)}
const IO_snd_n_0_91_0 = (m) => {exports.io.messageSenders['n_0_91']['0'](m)}
const IO_snd_n_0_92_0 = (m) => {exports.io.messageSenders['n_0_92']['0'](m)}
const IO_snd_n_0_96_0 = (m) => {exports.io.messageSenders['n_0_96']['0'](m)}
const IO_snd_n_0_97_0 = (m) => {exports.io.messageSenders['n_0_97']['0'](m)}
const IO_snd_n_0_98_0 = (m) => {exports.io.messageSenders['n_0_98']['0'](m)}
const IO_snd_n_0_99_0 = (m) => {exports.io.messageSenders['n_0_99']['0'](m)}
const IO_snd_n_0_103_0 = (m) => {exports.io.messageSenders['n_0_103']['0'](m)}
const IO_snd_n_0_104_0 = (m) => {exports.io.messageSenders['n_0_104']['0'](m)}
const IO_snd_n_0_105_0 = (m) => {exports.io.messageSenders['n_0_105']['0'](m)}
const IO_snd_n_0_106_0 = (m) => {exports.io.messageSenders['n_0_106']['0'](m)}
const IO_snd_n_0_114_0 = (m) => {exports.io.messageSenders['n_0_114']['0'](m)}
const IO_snd_n_0_116_0 = (m) => {exports.io.messageSenders['n_0_116']['0'](m)}
const IO_snd_n_0_125_0 = (m) => {exports.io.messageSenders['n_0_125']['0'](m)}
const IO_snd_n_0_126_0 = (m) => {exports.io.messageSenders['n_0_126']['0'](m)}
const IO_snd_n_0_127_0 = (m) => {exports.io.messageSenders['n_0_127']['0'](m)}
const IO_snd_n_0_134_0 = (m) => {exports.io.messageSenders['n_0_134']['0'](m)}
const IO_snd_n_0_135_0 = (m) => {exports.io.messageSenders['n_0_135']['0'](m)}
const IO_snd_n_0_147_0 = (m) => {exports.io.messageSenders['n_0_147']['0'](m)}
const IO_snd_n_0_161_0 = (m) => {exports.io.messageSenders['n_0_161']['0'](m)}
const IO_snd_n_0_165_0 = (m) => {exports.io.messageSenders['n_0_165']['0'](m)}
const IO_snd_n_0_166_0 = (m) => {exports.io.messageSenders['n_0_166']['0'](m)}
const IO_snd_n_0_173_0 = (m) => {exports.io.messageSenders['n_0_173']['0'](m)}
const IO_snd_n_0_187_0 = (m) => {exports.io.messageSenders['n_0_187']['0'](m)}
const IO_snd_n_0_191_0 = (m) => {exports.io.messageSenders['n_0_191']['0'](m)}
const IO_snd_n_0_192_0 = (m) => {exports.io.messageSenders['n_0_192']['0'](m)}
const IO_snd_n_0_199_0 = (m) => {exports.io.messageSenders['n_0_199']['0'](m)}
const IO_snd_n_0_220_0 = (m) => {exports.io.messageSenders['n_0_220']['0'](m)}
const IO_snd_n_0_221_0 = (m) => {exports.io.messageSenders['n_0_221']['0'](m)}
const IO_snd_n_0_222_0 = (m) => {exports.io.messageSenders['n_0_222']['0'](m)}
const IO_snd_n_0_223_0 = (m) => {exports.io.messageSenders['n_0_223']['0'](m)}
const IO_snd_n_0_224_0 = (m) => {exports.io.messageSenders['n_0_224']['0'](m)}
const IO_snd_n_0_225_0 = (m) => {exports.io.messageSenders['n_0_225']['0'](m)}
const IO_snd_n_0_235_0 = (m) => {exports.io.messageSenders['n_0_235']['0'](m)}
const IO_snd_n_0_236_0 = (m) => {exports.io.messageSenders['n_0_236']['0'](m)}
const IO_snd_n_0_240_0 = (m) => {exports.io.messageSenders['n_0_240']['0'](m)}
const IO_snd_n_0_241_0 = (m) => {exports.io.messageSenders['n_0_241']['0'](m)}
const IO_snd_n_0_251_0 = (m) => {exports.io.messageSenders['n_0_251']['0'](m)}
const IO_snd_n_0_252_0 = (m) => {exports.io.messageSenders['n_0_252']['0'](m)}
const IO_snd_n_0_260_0 = (m) => {exports.io.messageSenders['n_0_260']['0'](m)}
const IO_snd_n_0_261_0 = (m) => {exports.io.messageSenders['n_0_261']['0'](m)}
const IO_snd_n_0_270_0 = (m) => {exports.io.messageSenders['n_0_270']['0'](m)}
const IO_snd_n_0_271_0 = (m) => {exports.io.messageSenders['n_0_271']['0'](m)}
const IO_snd_n_0_284_0 = (m) => {exports.io.messageSenders['n_0_284']['0'](m)}
const IO_snd_n_0_285_0 = (m) => {exports.io.messageSenders['n_0_285']['0'](m)}
const IO_snd_n_0_286_0 = (m) => {exports.io.messageSenders['n_0_286']['0'](m)}
const IO_snd_n_0_287_0 = (m) => {exports.io.messageSenders['n_0_287']['0'](m)}
const IO_snd_n_0_8_0 = (m) => {exports.io.messageSenders['n_0_8']['0'](m)}
const IO_snd_n_0_21_0 = (m) => {exports.io.messageSenders['n_0_21']['0'](m)}
const IO_snd_n_0_24_0 = (m) => {exports.io.messageSenders['n_0_24']['0'](m)}
const IO_snd_n_0_27_0 = (m) => {exports.io.messageSenders['n_0_27']['0'](m)}
const IO_snd_n_0_30_0 = (m) => {exports.io.messageSenders['n_0_30']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.2.1","customMetadata":{"pdNodes":{"0":{"0":{"id":"0","type":"text","args":["========================================================="],"nodeClass":"text","layout":{"x":20,"y":20}},"1":{"id":"1","type":"text","args":["Frutiger Aero Chillout Sketch - Pure Data Vanilla"],"nodeClass":"text","layout":{"x":20,"y":36}},"2":{"id":"2","type":"text","args":["Generated using Python pd_patch_builder"],"nodeClass":"text","layout":{"x":20,"y":52}},"3":{"id":"3","type":"text","args":["========================================================="],"nodeClass":"text","layout":{"x":20,"y":68}},"4":{"id":"4","type":"text","args":["--- Transport & Clock (100 BPM) ---"],"nodeClass":"text","layout":{"x":50,"y":110}},"6":{"id":"6","type":"msg","args":[100],"nodeClass":"control","layout":{"x":50,"y":170}},"7":{"id":"7","type":"hsl","args":[70,130,0,70,"Tempo-BPM",""],"nodeClass":"control","layout":{"x":130,"y":170,"width":128,"height":15,"log":0,"label":"Tempo-BPM","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"-262144","fgColor":"-1","labelColor":"-1","steadyOnClick":"1"}},"11":{"id":"11","type":"msg","args":[1],"nodeClass":"control","layout":{"x":50,"y":210}},"17":{"id":"17","type":"floatatom","args":[0,0,"",""],"nodeClass":"control","layout":{"x":346,"y":250,"widthInChars":5,"labelPos":0,"label":"step"}},"18":{"id":"18","type":"text","args":["--- Real-Time GUI Sliders ---"],"nodeClass":"text","layout":{"x":50,"y":350}},"19":{"id":"19","type":"msg","args":[0],"nodeClass":"control","layout":{"x":50,"y":380}},"20":{"id":"20","type":"hsl","args":[-12,12,0,-12,"Transpose-Key",""],"nodeClass":"control","layout":{"x":130,"y":380,"width":128,"height":15,"log":0,"label":"Transpose-Key","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"-262144","fgColor":"-1","labelColor":"-1","steadyOnClick":"1"}},"22":{"id":"22","type":"msg","args":[0.6],"nodeClass":"control","layout":{"x":50,"y":420}},"23":{"id":"23","type":"hsl","args":[0,1,0,0,"SFX-Volume",""],"nodeClass":"control","layout":{"x":130,"y":420,"width":128,"height":15,"log":0,"label":"SFX-Volume","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"-262144","fgColor":"-1","labelColor":"-1","steadyOnClick":"1"}},"25":{"id":"25","type":"msg","args":[0.65],"nodeClass":"control","layout":{"x":50,"y":460}},"26":{"id":"26","type":"hsl","args":[0,0.9,0,0,"Delay-Feedback",""],"nodeClass":"control","layout":{"x":130,"y":460,"width":128,"height":15,"log":0,"label":"Delay-Feedback","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"-262144","fgColor":"-1","labelColor":"-1","steadyOnClick":"1"}},"28":{"id":"28","type":"msg","args":[0.22],"nodeClass":"control","layout":{"x":50,"y":500}},"29":{"id":"29","type":"hsl","args":[0,0.5,0,0,"Master-Gain",""],"nodeClass":"control","layout":{"x":130,"y":500,"width":128,"height":15,"log":0,"label":"Master-Gain","labelX":-2,"labelY":-8,"labelFont":"0","labelFontSize":10,"bgColor":"-262144","fgColor":"-1","labelColor":"-1","steadyOnClick":"1"}},"41":{"id":"41","type":"msg","args":[1,1],"nodeClass":"control","layout":{"x":130,"y":1020}},"42":{"id":"42","type":"msg","args":[0,50],"nodeClass":"control","layout":{"x":230,"y":1020}},"48":{"id":"48","type":"text","args":["--- Glassy Mallets (Composed Melody Line) ---"],"nodeClass":"text","layout":{"x":430,"y":100}},"50":{"id":"50","type":"msg","args":[76],"nodeClass":"control","layout":{"x":430,"y":160}},"51":{"id":"51","type":"msg","args":[77],"nodeClass":"control","layout":{"x":480,"y":160}},"52":{"id":"52","type":"msg","args":[79],"nodeClass":"control","layout":{"x":530,"y":160}},"53":{"id":"53","type":"msg","args":[81],"nodeClass":"control","layout":{"x":580,"y":160}},"54":{"id":"54","type":"msg","args":[83],"nodeClass":"control","layout":{"x":630,"y":160}},"55":{"id":"55","type":"msg","args":[84],"nodeClass":"control","layout":{"x":680,"y":160}},"56":{"id":"56","type":"msg","args":[86],"nodeClass":"control","layout":{"x":730,"y":160}},"57":{"id":"57","type":"msg","args":[88],"nodeClass":"control","layout":{"x":780,"y":160}},"67":{"id":"67","type":"msg","args":[1,2],"nodeClass":"control","layout":{"x":460,"y":260}},"68":{"id":"68","type":"msg","args":[0,140],"nodeClass":"control","layout":{"x":560,"y":260}},"80":{"id":"80","type":"msg","args":[0.3,150],"nodeClass":"control","layout":{"x":430,"y":600}},"81":{"id":"81","type":"msg","args":[0.7,150],"nodeClass":"control","layout":{"x":510,"y":600}},"87":{"id":"87","type":"text","args":["--- Soft Sine Pad (Sustained Chords) ---"],"nodeClass":"text","layout":{"x":430,"y":670}},"89":{"id":"89","type":"msg","args":[48],"nodeClass":"control","layout":{"x":430,"y":730}},"90":{"id":"90","type":"msg","args":[53],"nodeClass":"control","layout":{"x":470,"y":730}},"91":{"id":"91","type":"msg","args":[45],"nodeClass":"control","layout":{"x":510,"y":730}},"92":{"id":"92","type":"msg","args":[43],"nodeClass":"control","layout":{"x":550,"y":730}},"96":{"id":"96","type":"msg","args":[55],"nodeClass":"control","layout":{"x":430,"y":770}},"97":{"id":"97","type":"msg","args":[57],"nodeClass":"control","layout":{"x":470,"y":770}},"98":{"id":"98","type":"msg","args":[52],"nodeClass":"control","layout":{"x":510,"y":770}},"99":{"id":"99","type":"msg","args":[50],"nodeClass":"control","layout":{"x":550,"y":770}},"103":{"id":"103","type":"msg","args":[59],"nodeClass":"control","layout":{"x":430,"y":810}},"104":{"id":"104","type":"msg","args":[64],"nodeClass":"control","layout":{"x":470,"y":810}},"105":{"id":"105","type":"msg","args":[57],"nodeClass":"control","layout":{"x":510,"y":810}},"106":{"id":"106","type":"msg","args":[59],"nodeClass":"control","layout":{"x":550,"y":810}},"114":{"id":"114","type":"msg","args":[1,800],"nodeClass":"control","layout":{"x":480,"y":820}},"116":{"id":"116","type":"msg","args":[0,1500],"nodeClass":"control","layout":{"x":580,"y":820}},"123":{"id":"123","type":"text","args":["--- Warm Sub-Bass Line ---"],"nodeClass":"text","layout":{"x":430,"y":1000}},"125":{"id":"125","type":"msg","args":[36],"nodeClass":"control","layout":{"x":430,"y":1060}},"126":{"id":"126","type":"msg","args":[33],"nodeClass":"control","layout":{"x":480,"y":1060}},"127":{"id":"127","type":"msg","args":[31],"nodeClass":"control","layout":{"x":530,"y":1060}},"134":{"id":"134","type":"msg","args":[1,10],"nodeClass":"control","layout":{"x":460,"y":1100}},"135":{"id":"135","type":"msg","args":[0,160],"nodeClass":"control","layout":{"x":560,"y":1100}},"141":{"id":"141","type":"text","args":["--- Nature Foley (Wind & Random Water Drops) ---"],"nodeClass":"text","layout":{"x":800,"y":100}},"147":{"id":"147","type":"msg","args":["$1",5500],"nodeClass":"control","layout":{"x":880,"y":240}},"161":{"id":"161","type":"msg","args":["$1",",","$2",30],"nodeClass":"control","layout":{"x":960,"y":520}},"165":{"id":"165","type":"msg","args":[1,2],"nodeClass":"control","layout":{"x":830,"y":520}},"166":{"id":"166","type":"msg","args":[0,35],"nodeClass":"control","layout":{"x":930,"y":520}},"173":{"id":"173","type":"msg","args":["$1",150],"nodeClass":"control","layout":{"x":800,"y":620}},"187":{"id":"187","type":"msg","args":["$1",",","$2",45],"nodeClass":"control","layout":{"x":960,"y":940}},"191":{"id":"191","type":"msg","args":[1,2],"nodeClass":"control","layout":{"x":830,"y":940}},"192":{"id":"192","type":"msg","args":[0,45],"nodeClass":"control","layout":{"x":930,"y":940}},"199":{"id":"199","type":"msg","args":["$1",150],"nodeClass":"control","layout":{"x":800,"y":1040}},"220":{"id":"220","type":"msg","args":[91],"nodeClass":"control","layout":{"x":880,"y":1320}},"221":{"id":"221","type":"msg","args":[93],"nodeClass":"control","layout":{"x":940,"y":1320}},"222":{"id":"222","type":"msg","args":[96],"nodeClass":"control","layout":{"x":1000,"y":1320}},"223":{"id":"223","type":"msg","args":[98],"nodeClass":"control","layout":{"x":1060,"y":1320}},"224":{"id":"224","type":"msg","args":[100],"nodeClass":"control","layout":{"x":1120,"y":1320}},"225":{"id":"225","type":"msg","args":[103],"nodeClass":"control","layout":{"x":1180,"y":1320}},"235":{"id":"235","type":"msg","args":[1,2],"nodeClass":"control","layout":{"x":910,"y":1400}},"236":{"id":"236","type":"msg","args":[0,80],"nodeClass":"control","layout":{"x":1010,"y":1400}},"240":{"id":"240","type":"msg","args":[0.1,0,",",0.9,250],"nodeClass":"control","layout":{"x":960,"y":1480}},"241":{"id":"241","type":"msg","args":[0.9,0,",",0.1,250],"nodeClass":"control","layout":{"x":960,"y":1520}},"247":{"id":"247","type":"text","args":["--- Muted Chillout Drums ---"],"nodeClass":"text","layout":{"x":1200,"y":100}},"251":{"id":"251","type":"msg","args":[1,6],"nodeClass":"control","layout":{"x":1310,"y":80}},"252":{"id":"252","type":"msg","args":[0,150],"nodeClass":"control","layout":{"x":1410,"y":80}},"260":{"id":"260","type":"msg","args":[1,2],"nodeClass":"control","layout":{"x":1310,"y":260}},"261":{"id":"261","type":"msg","args":[0,50],"nodeClass":"control","layout":{"x":1410,"y":260}},"270":{"id":"270","type":"msg","args":[1,1],"nodeClass":"control","layout":{"x":1310,"y":480}},"271":{"id":"271","type":"msg","args":[0,25],"nodeClass":"control","layout":{"x":1410,"y":480}},"277":{"id":"277","type":"text","args":["--- Audio Sampler (Cute Pitched-up Wave Files) ---"],"nodeClass":"text","layout":{"x":50,"y":1250}},"284":{"id":"284","type":"msg","args":["read","-resize","cute-bloop.wav","sample_bloop"],"nodeClass":"control","layout":{"x":200,"y":1350}},"285":{"id":"285","type":"msg","args":["read","-resize","cute-water.wav","sample_water"],"nodeClass":"control","layout":{"x":200,"y":1390}},"286":{"id":"286","type":"msg","args":["read","-resize","cute-pop.wav","sample_pop"],"nodeClass":"control","layout":{"x":200,"y":1430}},"287":{"id":"287","type":"msg","args":["read","-resize","cute-chirp.wav","sample_chirp"],"nodeClass":"control","layout":{"x":200,"y":1470}},"319":{"id":"319","type":"text","args":["--- Master Mixer ---"],"nodeClass":"text","layout":{"x":1200,"y":740}}}},"graph":{"n_0_6":{"id":"n_0_6","type":"msg","args":{"msgSpecs":[{"tokens":[100],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_6_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_7","portletId":"0"},{"nodeId":"n_ioSnd_n_0_6_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_7":{"id":"n_0_7","type":"hsl","args":{"minValue":70,"maxValue":130,"sendBusName":"empty","receiveBusName":"Tempo-BPM","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_6","portletId":"0"},{"nodeId":"n_ioRcv_n_0_7_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_33","portletId":"0"},{"nodeId":"n_9_2","portletId":"0"},{"nodeId":"n_ioSnd_n_0_7_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_11":{"id":"n_0_11","type":"msg","args":{"msgSpecs":[{"tokens":[1],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_11_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_12","portletId":"0"},{"nodeId":"n_0_144","portletId":"0"},{"nodeId":"n_0_153","portletId":"0"},{"nodeId":"n_0_179","portletId":"0"},{"nodeId":"n_ioSnd_n_0_11_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_17":{"id":"n_0_17","type":"floatatom","args":{"sendBusName":"empty","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_0_15","portletId":"0"},{"nodeId":"n_ioRcv_n_0_17_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_17_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_19":{"id":"n_0_19","type":"msg","args":{"msgSpecs":[{"tokens":[0],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_19_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_20","portletId":"0"},{"nodeId":"n_ioSnd_n_0_19_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_20":{"id":"n_0_20","type":"hsl","args":{"minValue":-12,"maxValue":12,"sendBusName":"empty","receiveBusName":"Transpose-Key","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_19","portletId":"0"},{"nodeId":"n_ioRcv_n_0_20_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_31","portletId":"0"},{"nodeId":"n_0_58","portletId":"1"},{"nodeId":"n_0_93","portletId":"1"},{"nodeId":"n_0_100","portletId":"1"},{"nodeId":"n_0_107","portletId":"1"},{"nodeId":"n_0_128","portletId":"1"},{"nodeId":"n_0_226","portletId":"1"},{"nodeId":"n_ioSnd_n_0_20_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_22":{"id":"n_0_22","type":"msg","args":{"msgSpecs":[{"tokens":[0.6],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_22_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_ioSnd_n_0_22_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_23":{"id":"n_0_23","type":"hsl","args":{"minValue":0,"maxValue":1,"sendBusName":"empty","receiveBusName":"SFX-Volume","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_ioRcv_n_0_23_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_149_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_169_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_195_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_315_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_316_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_23_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_25":{"id":"n_0_25","type":"msg","args":{"msgSpecs":[{"tokens":[0.65],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_25_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_26","portletId":"0"},{"nodeId":"n_ioSnd_n_0_25_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_26":{"id":"n_0_26","type":"hsl","args":{"minValue":0,"maxValue":0.9,"sendBusName":"empty","receiveBusName":"Delay-Feedback","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_25","portletId":"0"},{"nodeId":"n_ioRcv_n_0_26_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_73_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_26_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_28":{"id":"n_0_28","type":"msg","args":{"msgSpecs":[{"tokens":[0.22],"send":null}]},"sources":{"0":[{"nodeId":"n_0_5","portletId":"0"},{"nodeId":"n_ioRcv_n_0_28_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_29","portletId":"0"},{"nodeId":"n_ioSnd_n_0_28_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_29":{"id":"n_0_29","type":"hsl","args":{"minValue":0,"maxValue":0.5,"sendBusName":"empty","receiveBusName":"Master-Gain","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_0_28","portletId":"0"},{"nodeId":"n_ioRcv_n_0_29_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"m_n_0_344_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_345_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_29_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_41":{"id":"n_0_41","type":"msg","args":{"msgSpecs":[{"tokens":[1,1],"send":null}]},"sources":{"0":[{"nodeId":"n_0_35","portletId":"0"},{"nodeId":"n_ioRcv_n_0_41_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_40","portletId":"0"},{"nodeId":"n_ioSnd_n_0_41_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_42":{"id":"n_0_42","type":"msg","args":{"msgSpecs":[{"tokens":[0,50],"send":null}]},"sources":{"0":[{"nodeId":"n_0_43","portletId":"0"},{"nodeId":"n_ioRcv_n_0_42_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_40","portletId":"0"},{"nodeId":"n_ioSnd_n_0_42_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_50":{"id":"n_0_50","type":"msg","args":{"msgSpecs":[{"tokens":[76],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"0"},{"nodeId":"n_0_49","portletId":"5"},{"nodeId":"n_ioRcv_n_0_50_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_50_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_51":{"id":"n_0_51","type":"msg","args":{"msgSpecs":[{"tokens":[77],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"6"},{"nodeId":"n_0_49","portletId":"11"},{"nodeId":"n_ioRcv_n_0_51_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_51_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_52":{"id":"n_0_52","type":"msg","args":{"msgSpecs":[{"tokens":[79],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"1"},{"nodeId":"n_0_49","portletId":"4"},{"nodeId":"n_0_49","portletId":"12"},{"nodeId":"n_0_49","portletId":"17"},{"nodeId":"n_0_49","portletId":"23"},{"nodeId":"n_ioRcv_n_0_52_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_52_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_53":{"id":"n_0_53","type":"msg","args":{"msgSpecs":[{"tokens":[81],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"3"},{"nodeId":"n_0_49","portletId":"7"},{"nodeId":"n_0_49","portletId":"10"},{"nodeId":"n_0_49","portletId":"18"},{"nodeId":"n_ioRcv_n_0_53_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_53_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_54":{"id":"n_0_54","type":"msg","args":{"msgSpecs":[{"tokens":[83],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"2"},{"nodeId":"n_0_49","portletId":"9"},{"nodeId":"n_0_49","portletId":"13"},{"nodeId":"n_0_49","portletId":"16"},{"nodeId":"n_0_49","portletId":"22"},{"nodeId":"n_ioRcv_n_0_54_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_54_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_55":{"id":"n_0_55","type":"msg","args":{"msgSpecs":[{"tokens":[84],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"8"},{"nodeId":"n_0_49","portletId":"15"},{"nodeId":"n_0_49","portletId":"19"},{"nodeId":"n_ioRcv_n_0_55_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_55_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_56":{"id":"n_0_56","type":"msg","args":{"msgSpecs":[{"tokens":[86],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"14"},{"nodeId":"n_0_49","portletId":"21"},{"nodeId":"n_ioRcv_n_0_56_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_56_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_57":{"id":"n_0_57","type":"msg","args":{"msgSpecs":[{"tokens":[88],"send":null}]},"sources":{"0":[{"nodeId":"n_0_49","portletId":"20"},{"nodeId":"n_ioRcv_n_0_57_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_ioSnd_n_0_57_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_67":{"id":"n_0_67","type":"msg","args":{"msgSpecs":[{"tokens":[1,2],"send":null}]},"sources":{"0":[{"nodeId":"n_0_65","portletId":"0"},{"nodeId":"n_ioRcv_n_0_67_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_66","portletId":"0"},{"nodeId":"n_ioSnd_n_0_67_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_68":{"id":"n_0_68","type":"msg","args":{"msgSpecs":[{"tokens":[0,140],"send":null}]},"sources":{"0":[{"nodeId":"n_0_69","portletId":"0"},{"nodeId":"n_ioRcv_n_0_68_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_66","portletId":"0"},{"nodeId":"n_ioSnd_n_0_68_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_80":{"id":"n_0_80","type":"msg","args":{"msgSpecs":[{"tokens":[0.3,150],"send":null}]},"sources":{"0":[{"nodeId":"n_0_79","portletId":"0"},{"nodeId":"n_ioRcv_n_0_80_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_82","portletId":"0"},{"nodeId":"n_ioSnd_n_0_80_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_81":{"id":"n_0_81","type":"msg","args":{"msgSpecs":[{"tokens":[0.7,150],"send":null}]},"sources":{"0":[{"nodeId":"n_0_79","portletId":"1"},{"nodeId":"n_ioRcv_n_0_81_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_82","portletId":"0"},{"nodeId":"n_ioSnd_n_0_81_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_89":{"id":"n_0_89","type":"msg","args":{"msgSpecs":[{"tokens":[48],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"0"},{"nodeId":"n_0_88","portletId":"2"},{"nodeId":"n_0_88","portletId":"4"},{"nodeId":"n_ioRcv_n_0_89_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_93","portletId":"0"},{"nodeId":"n_ioSnd_n_0_89_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_90":{"id":"n_0_90","type":"msg","args":{"msgSpecs":[{"tokens":[53],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"1"},{"nodeId":"n_0_88","portletId":"3"},{"nodeId":"n_0_88","portletId":"5"},{"nodeId":"n_ioRcv_n_0_90_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_93","portletId":"0"},{"nodeId":"n_ioSnd_n_0_90_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_91":{"id":"n_0_91","type":"msg","args":{"msgSpecs":[{"tokens":[45],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"6"},{"nodeId":"n_ioRcv_n_0_91_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_93","portletId":"0"},{"nodeId":"n_ioSnd_n_0_91_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_92":{"id":"n_0_92","type":"msg","args":{"msgSpecs":[{"tokens":[43],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"7"},{"nodeId":"n_ioRcv_n_0_92_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_93","portletId":"0"},{"nodeId":"n_ioSnd_n_0_92_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_96":{"id":"n_0_96","type":"msg","args":{"msgSpecs":[{"tokens":[55],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"0"},{"nodeId":"n_0_88","portletId":"2"},{"nodeId":"n_0_88","portletId":"4"},{"nodeId":"n_ioRcv_n_0_96_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_100","portletId":"0"},{"nodeId":"n_ioSnd_n_0_96_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_97":{"id":"n_0_97","type":"msg","args":{"msgSpecs":[{"tokens":[57],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"1"},{"nodeId":"n_0_88","portletId":"3"},{"nodeId":"n_0_88","portletId":"5"},{"nodeId":"n_ioRcv_n_0_97_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_100","portletId":"0"},{"nodeId":"n_ioSnd_n_0_97_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_98":{"id":"n_0_98","type":"msg","args":{"msgSpecs":[{"tokens":[52],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"6"},{"nodeId":"n_ioRcv_n_0_98_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_100","portletId":"0"},{"nodeId":"n_ioSnd_n_0_98_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_99":{"id":"n_0_99","type":"msg","args":{"msgSpecs":[{"tokens":[50],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"7"},{"nodeId":"n_ioRcv_n_0_99_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_100","portletId":"0"},{"nodeId":"n_ioSnd_n_0_99_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_103":{"id":"n_0_103","type":"msg","args":{"msgSpecs":[{"tokens":[59],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"0"},{"nodeId":"n_0_88","portletId":"2"},{"nodeId":"n_0_88","portletId":"4"},{"nodeId":"n_ioRcv_n_0_103_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_107","portletId":"0"},{"nodeId":"n_ioSnd_n_0_103_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_104":{"id":"n_0_104","type":"msg","args":{"msgSpecs":[{"tokens":[64],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"1"},{"nodeId":"n_0_88","portletId":"3"},{"nodeId":"n_0_88","portletId":"5"},{"nodeId":"n_ioRcv_n_0_104_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_107","portletId":"0"},{"nodeId":"n_ioSnd_n_0_104_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_105":{"id":"n_0_105","type":"msg","args":{"msgSpecs":[{"tokens":[57],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"6"},{"nodeId":"n_ioRcv_n_0_105_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_107","portletId":"0"},{"nodeId":"n_ioSnd_n_0_105_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_106":{"id":"n_0_106","type":"msg","args":{"msgSpecs":[{"tokens":[59],"send":null}]},"sources":{"0":[{"nodeId":"n_0_88","portletId":"7"},{"nodeId":"n_ioRcv_n_0_106_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_107","portletId":"0"},{"nodeId":"n_ioSnd_n_0_106_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_114":{"id":"n_0_114","type":"msg","args":{"msgSpecs":[{"tokens":[1,800],"send":null}]},"sources":{"0":[{"nodeId":"n_0_115","portletId":"0"},{"nodeId":"n_ioRcv_n_0_114_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_113","portletId":"0"},{"nodeId":"n_ioSnd_n_0_114_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_116":{"id":"n_0_116","type":"msg","args":{"msgSpecs":[{"tokens":[0,1500],"send":null}]},"sources":{"0":[{"nodeId":"n_0_117","portletId":"0"},{"nodeId":"n_ioRcv_n_0_116_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_113","portletId":"0"},{"nodeId":"n_ioSnd_n_0_116_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_125":{"id":"n_0_125","type":"msg","args":{"msgSpecs":[{"tokens":[36],"send":null}]},"sources":{"0":[{"nodeId":"n_0_124","portletId":"0"},{"nodeId":"n_0_124","portletId":"1"},{"nodeId":"n_0_124","portletId":"2"},{"nodeId":"n_0_124","portletId":"3"},{"nodeId":"n_0_124","portletId":"4"},{"nodeId":"n_0_124","portletId":"5"},{"nodeId":"n_0_124","portletId":"6"},{"nodeId":"n_0_124","portletId":"7"},{"nodeId":"n_0_124","portletId":"8"},{"nodeId":"n_0_124","portletId":"9"},{"nodeId":"n_0_124","portletId":"10"},{"nodeId":"n_0_124","portletId":"11"},{"nodeId":"n_ioRcv_n_0_125_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_128","portletId":"0"},{"nodeId":"n_ioSnd_n_0_125_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_126":{"id":"n_0_126","type":"msg","args":{"msgSpecs":[{"tokens":[33],"send":null}]},"sources":{"0":[{"nodeId":"n_0_124","portletId":"12"},{"nodeId":"n_0_124","portletId":"13"},{"nodeId":"n_ioRcv_n_0_126_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_128","portletId":"0"},{"nodeId":"n_ioSnd_n_0_126_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_127":{"id":"n_0_127","type":"msg","args":{"msgSpecs":[{"tokens":[31],"send":null}]},"sources":{"0":[{"nodeId":"n_0_124","portletId":"14"},{"nodeId":"n_0_124","portletId":"15"},{"nodeId":"n_ioRcv_n_0_127_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_128","portletId":"0"},{"nodeId":"n_ioSnd_n_0_127_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_134":{"id":"n_0_134","type":"msg","args":{"msgSpecs":[{"tokens":[1,10],"send":null}]},"sources":{"0":[{"nodeId":"n_0_132","portletId":"0"},{"nodeId":"n_ioRcv_n_0_134_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_133","portletId":"0"},{"nodeId":"n_ioSnd_n_0_134_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_135":{"id":"n_0_135","type":"msg","args":{"msgSpecs":[{"tokens":[0,160],"send":null}]},"sources":{"0":[{"nodeId":"n_0_136","portletId":"0"},{"nodeId":"n_ioRcv_n_0_135_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_133","portletId":"0"},{"nodeId":"n_ioSnd_n_0_135_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_147":{"id":"n_0_147","type":"msg","args":{"msgSpecs":[{"tokens":["$1",5500],"send":null}]},"sources":{"0":[{"nodeId":"n_0_146","portletId":"0"},{"nodeId":"n_ioRcv_n_0_147_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_148","portletId":"0"},{"nodeId":"n_ioSnd_n_0_147_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_161":{"id":"n_0_161","type":"msg","args":{"msgSpecs":[{"tokens":["$1"],"send":null},{"tokens":["$2",30],"send":null}]},"sources":{"0":[{"nodeId":"n_0_160","portletId":"0"},{"nodeId":"n_ioRcv_n_0_161_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_162","portletId":"0"},{"nodeId":"n_ioSnd_n_0_161_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_165":{"id":"n_0_165","type":"msg","args":{"msgSpecs":[{"tokens":[1,2],"send":null}]},"sources":{"0":[{"nodeId":"n_0_155","portletId":"0"},{"nodeId":"n_ioRcv_n_0_165_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_164","portletId":"0"},{"nodeId":"n_ioSnd_n_0_165_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_166":{"id":"n_0_166","type":"msg","args":{"msgSpecs":[{"tokens":[0,35],"send":null}]},"sources":{"0":[{"nodeId":"n_0_167","portletId":"0"},{"nodeId":"n_ioRcv_n_0_166_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_164","portletId":"0"},{"nodeId":"n_ioSnd_n_0_166_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_173":{"id":"n_0_173","type":"msg","args":{"msgSpecs":[{"tokens":["$1",150],"send":null}]},"sources":{"0":[{"nodeId":"n_0_172","portletId":"0"},{"nodeId":"n_ioRcv_n_0_173_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_174","portletId":"0"},{"nodeId":"n_ioSnd_n_0_173_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_187":{"id":"n_0_187","type":"msg","args":{"msgSpecs":[{"tokens":["$1"],"send":null},{"tokens":["$2",45],"send":null}]},"sources":{"0":[{"nodeId":"n_0_186","portletId":"0"},{"nodeId":"n_ioRcv_n_0_187_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_188","portletId":"0"},{"nodeId":"n_ioSnd_n_0_187_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_191":{"id":"n_0_191","type":"msg","args":{"msgSpecs":[{"tokens":[1,2],"send":null}]},"sources":{"0":[{"nodeId":"n_0_181","portletId":"0"},{"nodeId":"n_ioRcv_n_0_191_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_190","portletId":"0"},{"nodeId":"n_ioSnd_n_0_191_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_192":{"id":"n_0_192","type":"msg","args":{"msgSpecs":[{"tokens":[0,45],"send":null}]},"sources":{"0":[{"nodeId":"n_0_193","portletId":"0"},{"nodeId":"n_ioRcv_n_0_192_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_190","portletId":"0"},{"nodeId":"n_ioSnd_n_0_192_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_199":{"id":"n_0_199","type":"msg","args":{"msgSpecs":[{"tokens":["$1",150],"send":null}]},"sources":{"0":[{"nodeId":"n_0_198","portletId":"0"},{"nodeId":"n_ioRcv_n_0_199_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_200","portletId":"0"},{"nodeId":"n_ioSnd_n_0_199_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_220":{"id":"n_0_220","type":"msg","args":{"msgSpecs":[{"tokens":[91],"send":null}]},"sources":{"0":[{"nodeId":"n_0_209","portletId":"0"},{"nodeId":"n_0_219","portletId":"0"},{"nodeId":"n_ioRcv_n_0_220_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_220_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_221":{"id":"n_0_221","type":"msg","args":{"msgSpecs":[{"tokens":[93],"send":null}]},"sources":{"0":[{"nodeId":"n_0_210","portletId":"0"},{"nodeId":"n_0_218","portletId":"0"},{"nodeId":"n_ioRcv_n_0_221_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_221_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_222":{"id":"n_0_222","type":"msg","args":{"msgSpecs":[{"tokens":[96],"send":null}]},"sources":{"0":[{"nodeId":"n_0_211","portletId":"0"},{"nodeId":"n_0_217","portletId":"0"},{"nodeId":"n_ioRcv_n_0_222_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_222_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_223":{"id":"n_0_223","type":"msg","args":{"msgSpecs":[{"tokens":[98],"send":null}]},"sources":{"0":[{"nodeId":"n_0_212","portletId":"0"},{"nodeId":"n_0_216","portletId":"0"},{"nodeId":"n_ioRcv_n_0_223_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_223_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_224":{"id":"n_0_224","type":"msg","args":{"msgSpecs":[{"tokens":[100],"send":null}]},"sources":{"0":[{"nodeId":"n_0_213","portletId":"0"},{"nodeId":"n_0_215","portletId":"0"},{"nodeId":"n_ioRcv_n_0_224_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_224_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_225":{"id":"n_0_225","type":"msg","args":{"msgSpecs":[{"tokens":[103],"send":null}]},"sources":{"0":[{"nodeId":"n_0_214","portletId":"0"},{"nodeId":"n_0_209","portletId":"1"},{"nodeId":"n_ioRcv_n_0_225_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_226","portletId":"0"},{"nodeId":"n_ioSnd_n_0_225_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_235":{"id":"n_0_235","type":"msg","args":{"msgSpecs":[{"tokens":[1,2],"send":null}]},"sources":{"0":[{"nodeId":"n_0_233","portletId":"0"},{"nodeId":"n_ioRcv_n_0_235_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_234","portletId":"0"},{"nodeId":"n_ioSnd_n_0_235_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_236":{"id":"n_0_236","type":"msg","args":{"msgSpecs":[{"tokens":[0,80],"send":null}]},"sources":{"0":[{"nodeId":"n_0_237","portletId":"0"},{"nodeId":"n_ioRcv_n_0_236_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_234","portletId":"0"},{"nodeId":"n_ioSnd_n_0_236_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_240":{"id":"n_0_240","type":"msg","args":{"msgSpecs":[{"tokens":[0.1,0],"send":null},{"tokens":[0.9,250],"send":null}]},"sources":{"0":[{"nodeId":"n_0_209","portletId":"0"},{"nodeId":"n_ioRcv_n_0_240_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_242","portletId":"0"},{"nodeId":"n_ioSnd_n_0_240_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_241":{"id":"n_0_241","type":"msg","args":{"msgSpecs":[{"tokens":[0.9,0],"send":null},{"tokens":[0.1,250],"send":null}]},"sources":{"0":[{"nodeId":"n_0_209","portletId":"1"},{"nodeId":"n_ioRcv_n_0_241_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_242","portletId":"0"},{"nodeId":"n_ioSnd_n_0_241_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_251":{"id":"n_0_251","type":"msg","args":{"msgSpecs":[{"tokens":[1,6],"send":null}]},"sources":{"0":[{"nodeId":"n_0_249","portletId":"0"},{"nodeId":"n_ioRcv_n_0_251_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_250","portletId":"0"},{"nodeId":"n_ioSnd_n_0_251_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_252":{"id":"n_0_252","type":"msg","args":{"msgSpecs":[{"tokens":[0,150],"send":null}]},"sources":{"0":[{"nodeId":"n_0_253","portletId":"0"},{"nodeId":"n_ioRcv_n_0_252_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_250","portletId":"0"},{"nodeId":"n_ioSnd_n_0_252_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_260":{"id":"n_0_260","type":"msg","args":{"msgSpecs":[{"tokens":[1,2],"send":null}]},"sources":{"0":[{"nodeId":"n_0_258","portletId":"0"},{"nodeId":"n_ioRcv_n_0_260_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_259","portletId":"0"},{"nodeId":"n_ioSnd_n_0_260_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_261":{"id":"n_0_261","type":"msg","args":{"msgSpecs":[{"tokens":[0,50],"send":null}]},"sources":{"0":[{"nodeId":"n_0_262","portletId":"0"},{"nodeId":"n_ioRcv_n_0_261_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_259","portletId":"0"},{"nodeId":"n_ioSnd_n_0_261_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_270":{"id":"n_0_270","type":"msg","args":{"msgSpecs":[{"tokens":[1,1],"send":null}]},"sources":{"0":[{"nodeId":"n_0_268","portletId":"0"},{"nodeId":"n_ioRcv_n_0_270_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_269","portletId":"0"},{"nodeId":"n_ioSnd_n_0_270_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_271":{"id":"n_0_271","type":"msg","args":{"msgSpecs":[{"tokens":[0,25],"send":null}]},"sources":{"0":[{"nodeId":"n_0_272","portletId":"0"},{"nodeId":"n_ioRcv_n_0_271_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_269","portletId":"0"},{"nodeId":"n_ioSnd_n_0_271_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_284":{"id":"n_0_284","type":"msg","args":{"msgSpecs":[{"tokens":["read","-resize","cute-bloop.wav","sample_bloop"],"send":null}]},"sources":{"0":[{"nodeId":"n_0_283","portletId":"0"},{"nodeId":"n_ioRcv_n_0_284_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_288","portletId":"0"},{"nodeId":"n_ioSnd_n_0_284_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_285":{"id":"n_0_285","type":"msg","args":{"msgSpecs":[{"tokens":["read","-resize","cute-water.wav","sample_water"],"send":null}]},"sources":{"0":[{"nodeId":"n_0_283","portletId":"0"},{"nodeId":"n_ioRcv_n_0_285_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_288","portletId":"0"},{"nodeId":"n_ioSnd_n_0_285_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_286":{"id":"n_0_286","type":"msg","args":{"msgSpecs":[{"tokens":["read","-resize","cute-pop.wav","sample_pop"],"send":null}]},"sources":{"0":[{"nodeId":"n_0_283","portletId":"0"},{"nodeId":"n_ioRcv_n_0_286_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_288","portletId":"0"},{"nodeId":"n_ioSnd_n_0_286_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_287":{"id":"n_0_287","type":"msg","args":{"msgSpecs":[{"tokens":["read","-resize","cute-chirp.wav","sample_chirp"],"send":null}]},"sources":{"0":[{"nodeId":"n_0_283","portletId":"0"},{"nodeId":"n_ioRcv_n_0_287_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_0_288","portletId":"0"},{"nodeId":"n_ioSnd_n_0_287_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}}},"n_0_8":{"id":"n_0_8","type":"receive","args":{"busName":"Tempo-BPM"},"sources":{},"sinks":{"0":[{"nodeId":"n_0_33","portletId":"0"},{"nodeId":"n_9_2","portletId":"0"},{"nodeId":"n_ioSnd_n_0_8_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_21":{"id":"n_0_21","type":"receive","args":{"busName":"Transpose-Key"},"sources":{},"sinks":{"0":[{"nodeId":"n_0_31","portletId":"0"},{"nodeId":"n_0_58","portletId":"1"},{"nodeId":"n_0_93","portletId":"1"},{"nodeId":"n_0_100","portletId":"1"},{"nodeId":"n_0_107","portletId":"1"},{"nodeId":"n_0_128","portletId":"1"},{"nodeId":"n_0_226","portletId":"1"},{"nodeId":"n_ioSnd_n_0_21_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_24":{"id":"n_0_24","type":"receive","args":{"busName":"SFX-Volume"},"sources":{},"sinks":{"0":[{"nodeId":"m_n_0_149_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_169_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_195_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_315_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_316_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_24_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_27":{"id":"n_0_27","type":"receive","args":{"busName":"Delay-Feedback"},"sources":{},"sinks":{"0":[{"nodeId":"m_n_0_73_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_27_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_30":{"id":"n_0_30","type":"receive","args":{"busName":"Master-Gain"},"sources":{},"sinks":{"0":[{"nodeId":"m_n_0_344_1__routemsg","portletId":"0"},{"nodeId":"m_n_0_345_1__routemsg","portletId":"0"},{"nodeId":"n_ioSnd_n_0_30_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true}},"pdGui":[{"nodeClass":"text","patchId":"0","pdNodeId":"0"},{"nodeClass":"text","patchId":"0","pdNodeId":"1"},{"nodeClass":"text","patchId":"0","pdNodeId":"2"},{"nodeClass":"text","patchId":"0","pdNodeId":"3"},{"nodeClass":"text","patchId":"0","pdNodeId":"4"},{"nodeClass":"control","patchId":"0","pdNodeId":"6","nodeId":"n_0_6"},{"nodeClass":"control","patchId":"0","pdNodeId":"7","nodeId":"n_0_7"},{"nodeClass":"control","patchId":"0","pdNodeId":"11","nodeId":"n_0_11"},{"nodeClass":"control","patchId":"0","pdNodeId":"17","nodeId":"n_0_17"},{"nodeClass":"text","patchId":"0","pdNodeId":"18"},{"nodeClass":"control","patchId":"0","pdNodeId":"19","nodeId":"n_0_19"},{"nodeClass":"control","patchId":"0","pdNodeId":"20","nodeId":"n_0_20"},{"nodeClass":"control","patchId":"0","pdNodeId":"22","nodeId":"n_0_22"},{"nodeClass":"control","patchId":"0","pdNodeId":"23","nodeId":"n_0_23"},{"nodeClass":"control","patchId":"0","pdNodeId":"25","nodeId":"n_0_25"},{"nodeClass":"control","patchId":"0","pdNodeId":"26","nodeId":"n_0_26"},{"nodeClass":"control","patchId":"0","pdNodeId":"28","nodeId":"n_0_28"},{"nodeClass":"control","patchId":"0","pdNodeId":"29","nodeId":"n_0_29"},{"nodeClass":"control","patchId":"0","pdNodeId":"41","nodeId":"n_0_41"},{"nodeClass":"control","patchId":"0","pdNodeId":"42","nodeId":"n_0_42"},{"nodeClass":"text","patchId":"0","pdNodeId":"48"},{"nodeClass":"control","patchId":"0","pdNodeId":"50","nodeId":"n_0_50"},{"nodeClass":"control","patchId":"0","pdNodeId":"51","nodeId":"n_0_51"},{"nodeClass":"control","patchId":"0","pdNodeId":"52","nodeId":"n_0_52"},{"nodeClass":"control","patchId":"0","pdNodeId":"53","nodeId":"n_0_53"},{"nodeClass":"control","patchId":"0","pdNodeId":"54","nodeId":"n_0_54"},{"nodeClass":"control","patchId":"0","pdNodeId":"55","nodeId":"n_0_55"},{"nodeClass":"control","patchId":"0","pdNodeId":"56","nodeId":"n_0_56"},{"nodeClass":"control","patchId":"0","pdNodeId":"57","nodeId":"n_0_57"},{"nodeClass":"control","patchId":"0","pdNodeId":"67","nodeId":"n_0_67"},{"nodeClass":"control","patchId":"0","pdNodeId":"68","nodeId":"n_0_68"},{"nodeClass":"control","patchId":"0","pdNodeId":"80","nodeId":"n_0_80"},{"nodeClass":"control","patchId":"0","pdNodeId":"81","nodeId":"n_0_81"},{"nodeClass":"text","patchId":"0","pdNodeId":"87"},{"nodeClass":"control","patchId":"0","pdNodeId":"89","nodeId":"n_0_89"},{"nodeClass":"control","patchId":"0","pdNodeId":"90","nodeId":"n_0_90"},{"nodeClass":"control","patchId":"0","pdNodeId":"91","nodeId":"n_0_91"},{"nodeClass":"control","patchId":"0","pdNodeId":"92","nodeId":"n_0_92"},{"nodeClass":"control","patchId":"0","pdNodeId":"96","nodeId":"n_0_96"},{"nodeClass":"control","patchId":"0","pdNodeId":"97","nodeId":"n_0_97"},{"nodeClass":"control","patchId":"0","pdNodeId":"98","nodeId":"n_0_98"},{"nodeClass":"control","patchId":"0","pdNodeId":"99","nodeId":"n_0_99"},{"nodeClass":"control","patchId":"0","pdNodeId":"103","nodeId":"n_0_103"},{"nodeClass":"control","patchId":"0","pdNodeId":"104","nodeId":"n_0_104"},{"nodeClass":"control","patchId":"0","pdNodeId":"105","nodeId":"n_0_105"},{"nodeClass":"control","patchId":"0","pdNodeId":"106","nodeId":"n_0_106"},{"nodeClass":"control","patchId":"0","pdNodeId":"114","nodeId":"n_0_114"},{"nodeClass":"control","patchId":"0","pdNodeId":"116","nodeId":"n_0_116"},{"nodeClass":"text","patchId":"0","pdNodeId":"123"},{"nodeClass":"control","patchId":"0","pdNodeId":"125","nodeId":"n_0_125"},{"nodeClass":"control","patchId":"0","pdNodeId":"126","nodeId":"n_0_126"},{"nodeClass":"control","patchId":"0","pdNodeId":"127","nodeId":"n_0_127"},{"nodeClass":"control","patchId":"0","pdNodeId":"134","nodeId":"n_0_134"},{"nodeClass":"control","patchId":"0","pdNodeId":"135","nodeId":"n_0_135"},{"nodeClass":"text","patchId":"0","pdNodeId":"141"},{"nodeClass":"control","patchId":"0","pdNodeId":"147","nodeId":"n_0_147"},{"nodeClass":"control","patchId":"0","pdNodeId":"161","nodeId":"n_0_161"},{"nodeClass":"control","patchId":"0","pdNodeId":"165","nodeId":"n_0_165"},{"nodeClass":"control","patchId":"0","pdNodeId":"166","nodeId":"n_0_166"},{"nodeClass":"control","patchId":"0","pdNodeId":"173","nodeId":"n_0_173"},{"nodeClass":"control","patchId":"0","pdNodeId":"187","nodeId":"n_0_187"},{"nodeClass":"control","patchId":"0","pdNodeId":"191","nodeId":"n_0_191"},{"nodeClass":"control","patchId":"0","pdNodeId":"192","nodeId":"n_0_192"},{"nodeClass":"control","patchId":"0","pdNodeId":"199","nodeId":"n_0_199"},{"nodeClass":"control","patchId":"0","pdNodeId":"220","nodeId":"n_0_220"},{"nodeClass":"control","patchId":"0","pdNodeId":"221","nodeId":"n_0_221"},{"nodeClass":"control","patchId":"0","pdNodeId":"222","nodeId":"n_0_222"},{"nodeClass":"control","patchId":"0","pdNodeId":"223","nodeId":"n_0_223"},{"nodeClass":"control","patchId":"0","pdNodeId":"224","nodeId":"n_0_224"},{"nodeClass":"control","patchId":"0","pdNodeId":"225","nodeId":"n_0_225"},{"nodeClass":"control","patchId":"0","pdNodeId":"235","nodeId":"n_0_235"},{"nodeClass":"control","patchId":"0","pdNodeId":"236","nodeId":"n_0_236"},{"nodeClass":"control","patchId":"0","pdNodeId":"240","nodeId":"n_0_240"},{"nodeClass":"control","patchId":"0","pdNodeId":"241","nodeId":"n_0_241"},{"nodeClass":"text","patchId":"0","pdNodeId":"247"},{"nodeClass":"control","patchId":"0","pdNodeId":"251","nodeId":"n_0_251"},{"nodeClass":"control","patchId":"0","pdNodeId":"252","nodeId":"n_0_252"},{"nodeClass":"control","patchId":"0","pdNodeId":"260","nodeId":"n_0_260"},{"nodeClass":"control","patchId":"0","pdNodeId":"261","nodeId":"n_0_261"},{"nodeClass":"control","patchId":"0","pdNodeId":"270","nodeId":"n_0_270"},{"nodeClass":"control","patchId":"0","pdNodeId":"271","nodeId":"n_0_271"},{"nodeClass":"text","patchId":"0","pdNodeId":"277"},{"nodeClass":"control","patchId":"0","pdNodeId":"284","nodeId":"n_0_284"},{"nodeClass":"control","patchId":"0","pdNodeId":"285","nodeId":"n_0_285"},{"nodeClass":"control","patchId":"0","pdNodeId":"286","nodeId":"n_0_286"},{"nodeClass":"control","patchId":"0","pdNodeId":"287","nodeId":"n_0_287"},{"nodeClass":"text","patchId":"0","pdNodeId":"319"}]},"settings":{"audio":{"bitDepth":64,"channelCount":{"in":2,"out":2},"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_6":["0"],"n_0_7":["0"],"n_0_11":["0"],"n_0_17":["0"],"n_0_19":["0"],"n_0_20":["0"],"n_0_22":["0"],"n_0_23":["0"],"n_0_25":["0"],"n_0_26":["0"],"n_0_28":["0"],"n_0_29":["0"],"n_0_41":["0"],"n_0_42":["0"],"n_0_50":["0"],"n_0_51":["0"],"n_0_52":["0"],"n_0_53":["0"],"n_0_54":["0"],"n_0_55":["0"],"n_0_56":["0"],"n_0_57":["0"],"n_0_67":["0"],"n_0_68":["0"],"n_0_80":["0"],"n_0_81":["0"],"n_0_89":["0"],"n_0_90":["0"],"n_0_91":["0"],"n_0_92":["0"],"n_0_96":["0"],"n_0_97":["0"],"n_0_98":["0"],"n_0_99":["0"],"n_0_103":["0"],"n_0_104":["0"],"n_0_105":["0"],"n_0_106":["0"],"n_0_114":["0"],"n_0_116":["0"],"n_0_125":["0"],"n_0_126":["0"],"n_0_127":["0"],"n_0_134":["0"],"n_0_135":["0"],"n_0_147":["0"],"n_0_161":["0"],"n_0_165":["0"],"n_0_166":["0"],"n_0_173":["0"],"n_0_187":["0"],"n_0_191":["0"],"n_0_192":["0"],"n_0_199":["0"],"n_0_220":["0"],"n_0_221":["0"],"n_0_222":["0"],"n_0_223":["0"],"n_0_224":["0"],"n_0_225":["0"],"n_0_235":["0"],"n_0_236":["0"],"n_0_240":["0"],"n_0_241":["0"],"n_0_251":["0"],"n_0_252":["0"],"n_0_260":["0"],"n_0_261":["0"],"n_0_270":["0"],"n_0_271":["0"],"n_0_284":["0"],"n_0_285":["0"],"n_0_286":["0"],"n_0_287":["0"]},"messageSenders":{"n_0_6":["0"],"n_0_7":["0"],"n_0_11":["0"],"n_0_17":["0"],"n_0_19":["0"],"n_0_20":["0"],"n_0_22":["0"],"n_0_23":["0"],"n_0_25":["0"],"n_0_26":["0"],"n_0_28":["0"],"n_0_29":["0"],"n_0_41":["0"],"n_0_42":["0"],"n_0_50":["0"],"n_0_51":["0"],"n_0_52":["0"],"n_0_53":["0"],"n_0_54":["0"],"n_0_55":["0"],"n_0_56":["0"],"n_0_57":["0"],"n_0_67":["0"],"n_0_68":["0"],"n_0_80":["0"],"n_0_81":["0"],"n_0_89":["0"],"n_0_90":["0"],"n_0_91":["0"],"n_0_92":["0"],"n_0_96":["0"],"n_0_97":["0"],"n_0_98":["0"],"n_0_99":["0"],"n_0_103":["0"],"n_0_104":["0"],"n_0_105":["0"],"n_0_106":["0"],"n_0_114":["0"],"n_0_116":["0"],"n_0_125":["0"],"n_0_126":["0"],"n_0_127":["0"],"n_0_134":["0"],"n_0_135":["0"],"n_0_147":["0"],"n_0_161":["0"],"n_0_165":["0"],"n_0_166":["0"],"n_0_173":["0"],"n_0_187":["0"],"n_0_191":["0"],"n_0_192":["0"],"n_0_199":["0"],"n_0_220":["0"],"n_0_221":["0"],"n_0_222":["0"],"n_0_223":["0"],"n_0_224":["0"],"n_0_225":["0"],"n_0_235":["0"],"n_0_236":["0"],"n_0_240":["0"],"n_0_241":["0"],"n_0_251":["0"],"n_0_252":["0"],"n_0_260":["0"],"n_0_261":["0"],"n_0_270":["0"],"n_0_271":["0"],"n_0_284":["0"],"n_0_285":["0"],"n_0_286":["0"],"n_0_287":["0"],"n_0_8":["0"],"n_0_21":["0"],"n_0_24":["0"],"n_0_27":["0"],"n_0_30":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_6":{"0":"IO_rcv_n_0_6_0"},"n_0_7":{"0":"IO_rcv_n_0_7_0"},"n_0_11":{"0":"IO_rcv_n_0_11_0"},"n_0_17":{"0":"IO_rcv_n_0_17_0"},"n_0_19":{"0":"IO_rcv_n_0_19_0"},"n_0_20":{"0":"IO_rcv_n_0_20_0"},"n_0_22":{"0":"IO_rcv_n_0_22_0"},"n_0_23":{"0":"IO_rcv_n_0_23_0"},"n_0_25":{"0":"IO_rcv_n_0_25_0"},"n_0_26":{"0":"IO_rcv_n_0_26_0"},"n_0_28":{"0":"IO_rcv_n_0_28_0"},"n_0_29":{"0":"IO_rcv_n_0_29_0"},"n_0_41":{"0":"IO_rcv_n_0_41_0"},"n_0_42":{"0":"IO_rcv_n_0_42_0"},"n_0_50":{"0":"IO_rcv_n_0_50_0"},"n_0_51":{"0":"IO_rcv_n_0_51_0"},"n_0_52":{"0":"IO_rcv_n_0_52_0"},"n_0_53":{"0":"IO_rcv_n_0_53_0"},"n_0_54":{"0":"IO_rcv_n_0_54_0"},"n_0_55":{"0":"IO_rcv_n_0_55_0"},"n_0_56":{"0":"IO_rcv_n_0_56_0"},"n_0_57":{"0":"IO_rcv_n_0_57_0"},"n_0_67":{"0":"IO_rcv_n_0_67_0"},"n_0_68":{"0":"IO_rcv_n_0_68_0"},"n_0_80":{"0":"IO_rcv_n_0_80_0"},"n_0_81":{"0":"IO_rcv_n_0_81_0"},"n_0_89":{"0":"IO_rcv_n_0_89_0"},"n_0_90":{"0":"IO_rcv_n_0_90_0"},"n_0_91":{"0":"IO_rcv_n_0_91_0"},"n_0_92":{"0":"IO_rcv_n_0_92_0"},"n_0_96":{"0":"IO_rcv_n_0_96_0"},"n_0_97":{"0":"IO_rcv_n_0_97_0"},"n_0_98":{"0":"IO_rcv_n_0_98_0"},"n_0_99":{"0":"IO_rcv_n_0_99_0"},"n_0_103":{"0":"IO_rcv_n_0_103_0"},"n_0_104":{"0":"IO_rcv_n_0_104_0"},"n_0_105":{"0":"IO_rcv_n_0_105_0"},"n_0_106":{"0":"IO_rcv_n_0_106_0"},"n_0_114":{"0":"IO_rcv_n_0_114_0"},"n_0_116":{"0":"IO_rcv_n_0_116_0"},"n_0_125":{"0":"IO_rcv_n_0_125_0"},"n_0_126":{"0":"IO_rcv_n_0_126_0"},"n_0_127":{"0":"IO_rcv_n_0_127_0"},"n_0_134":{"0":"IO_rcv_n_0_134_0"},"n_0_135":{"0":"IO_rcv_n_0_135_0"},"n_0_147":{"0":"IO_rcv_n_0_147_0"},"n_0_161":{"0":"IO_rcv_n_0_161_0"},"n_0_165":{"0":"IO_rcv_n_0_165_0"},"n_0_166":{"0":"IO_rcv_n_0_166_0"},"n_0_173":{"0":"IO_rcv_n_0_173_0"},"n_0_187":{"0":"IO_rcv_n_0_187_0"},"n_0_191":{"0":"IO_rcv_n_0_191_0"},"n_0_192":{"0":"IO_rcv_n_0_192_0"},"n_0_199":{"0":"IO_rcv_n_0_199_0"},"n_0_220":{"0":"IO_rcv_n_0_220_0"},"n_0_221":{"0":"IO_rcv_n_0_221_0"},"n_0_222":{"0":"IO_rcv_n_0_222_0"},"n_0_223":{"0":"IO_rcv_n_0_223_0"},"n_0_224":{"0":"IO_rcv_n_0_224_0"},"n_0_225":{"0":"IO_rcv_n_0_225_0"},"n_0_235":{"0":"IO_rcv_n_0_235_0"},"n_0_236":{"0":"IO_rcv_n_0_236_0"},"n_0_240":{"0":"IO_rcv_n_0_240_0"},"n_0_241":{"0":"IO_rcv_n_0_241_0"},"n_0_251":{"0":"IO_rcv_n_0_251_0"},"n_0_252":{"0":"IO_rcv_n_0_252_0"},"n_0_260":{"0":"IO_rcv_n_0_260_0"},"n_0_261":{"0":"IO_rcv_n_0_261_0"},"n_0_270":{"0":"IO_rcv_n_0_270_0"},"n_0_271":{"0":"IO_rcv_n_0_271_0"},"n_0_284":{"0":"IO_rcv_n_0_284_0"},"n_0_285":{"0":"IO_rcv_n_0_285_0"},"n_0_286":{"0":"IO_rcv_n_0_286_0"},"n_0_287":{"0":"IO_rcv_n_0_287_0"}},"messageSenders":{"n_0_6":{"0":"IO_snd_n_0_6_0"},"n_0_7":{"0":"IO_snd_n_0_7_0"},"n_0_11":{"0":"IO_snd_n_0_11_0"},"n_0_17":{"0":"IO_snd_n_0_17_0"},"n_0_19":{"0":"IO_snd_n_0_19_0"},"n_0_20":{"0":"IO_snd_n_0_20_0"},"n_0_22":{"0":"IO_snd_n_0_22_0"},"n_0_23":{"0":"IO_snd_n_0_23_0"},"n_0_25":{"0":"IO_snd_n_0_25_0"},"n_0_26":{"0":"IO_snd_n_0_26_0"},"n_0_28":{"0":"IO_snd_n_0_28_0"},"n_0_29":{"0":"IO_snd_n_0_29_0"},"n_0_41":{"0":"IO_snd_n_0_41_0"},"n_0_42":{"0":"IO_snd_n_0_42_0"},"n_0_50":{"0":"IO_snd_n_0_50_0"},"n_0_51":{"0":"IO_snd_n_0_51_0"},"n_0_52":{"0":"IO_snd_n_0_52_0"},"n_0_53":{"0":"IO_snd_n_0_53_0"},"n_0_54":{"0":"IO_snd_n_0_54_0"},"n_0_55":{"0":"IO_snd_n_0_55_0"},"n_0_56":{"0":"IO_snd_n_0_56_0"},"n_0_57":{"0":"IO_snd_n_0_57_0"},"n_0_67":{"0":"IO_snd_n_0_67_0"},"n_0_68":{"0":"IO_snd_n_0_68_0"},"n_0_80":{"0":"IO_snd_n_0_80_0"},"n_0_81":{"0":"IO_snd_n_0_81_0"},"n_0_89":{"0":"IO_snd_n_0_89_0"},"n_0_90":{"0":"IO_snd_n_0_90_0"},"n_0_91":{"0":"IO_snd_n_0_91_0"},"n_0_92":{"0":"IO_snd_n_0_92_0"},"n_0_96":{"0":"IO_snd_n_0_96_0"},"n_0_97":{"0":"IO_snd_n_0_97_0"},"n_0_98":{"0":"IO_snd_n_0_98_0"},"n_0_99":{"0":"IO_snd_n_0_99_0"},"n_0_103":{"0":"IO_snd_n_0_103_0"},"n_0_104":{"0":"IO_snd_n_0_104_0"},"n_0_105":{"0":"IO_snd_n_0_105_0"},"n_0_106":{"0":"IO_snd_n_0_106_0"},"n_0_114":{"0":"IO_snd_n_0_114_0"},"n_0_116":{"0":"IO_snd_n_0_116_0"},"n_0_125":{"0":"IO_snd_n_0_125_0"},"n_0_126":{"0":"IO_snd_n_0_126_0"},"n_0_127":{"0":"IO_snd_n_0_127_0"},"n_0_134":{"0":"IO_snd_n_0_134_0"},"n_0_135":{"0":"IO_snd_n_0_135_0"},"n_0_147":{"0":"IO_snd_n_0_147_0"},"n_0_161":{"0":"IO_snd_n_0_161_0"},"n_0_165":{"0":"IO_snd_n_0_165_0"},"n_0_166":{"0":"IO_snd_n_0_166_0"},"n_0_173":{"0":"IO_snd_n_0_173_0"},"n_0_187":{"0":"IO_snd_n_0_187_0"},"n_0_191":{"0":"IO_snd_n_0_191_0"},"n_0_192":{"0":"IO_snd_n_0_192_0"},"n_0_199":{"0":"IO_snd_n_0_199_0"},"n_0_220":{"0":"IO_snd_n_0_220_0"},"n_0_221":{"0":"IO_snd_n_0_221_0"},"n_0_222":{"0":"IO_snd_n_0_222_0"},"n_0_223":{"0":"IO_snd_n_0_223_0"},"n_0_224":{"0":"IO_snd_n_0_224_0"},"n_0_225":{"0":"IO_snd_n_0_225_0"},"n_0_235":{"0":"IO_snd_n_0_235_0"},"n_0_236":{"0":"IO_snd_n_0_236_0"},"n_0_240":{"0":"IO_snd_n_0_240_0"},"n_0_241":{"0":"IO_snd_n_0_241_0"},"n_0_251":{"0":"IO_snd_n_0_251_0"},"n_0_252":{"0":"IO_snd_n_0_252_0"},"n_0_260":{"0":"IO_snd_n_0_260_0"},"n_0_261":{"0":"IO_snd_n_0_261_0"},"n_0_270":{"0":"IO_snd_n_0_270_0"},"n_0_271":{"0":"IO_snd_n_0_271_0"},"n_0_284":{"0":"IO_snd_n_0_284_0"},"n_0_285":{"0":"IO_snd_n_0_285_0"},"n_0_286":{"0":"IO_snd_n_0_286_0"},"n_0_287":{"0":"IO_snd_n_0_287_0"},"n_0_8":{"0":"IO_snd_n_0_8_0"},"n_0_21":{"0":"IO_snd_n_0_21_0"},"n_0_24":{"0":"IO_snd_n_0_24_0"},"n_0_27":{"0":"IO_snd_n_0_27_0"},"n_0_30":{"0":"IO_snd_n_0_30_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"},"fs":{"i_readSoundFile":"G_fs_i_readSoundFile","x_onReadSoundFileResponse":"G_fs_x_onReadSoundFileResponse","i_writeSoundFile":"G_fs_i_writeSoundFile","x_onWriteSoundFileResponse":"G_fs_x_onWriteSoundFileResponse"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                G_commons_waitFrame(0, () => N_n_0_5_snds_0(G_bangUtils_bang()))

            N_n_0_6_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_6_state.msgSpecs[0].outTemplate = []

                N_n_0_6_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_6_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_6_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_6_state.msgSpecs[0].outMessage, 0, 100)
            
        

                N_n_0_7_state.messageSender = N_n_0_7_snds_0
                N_n_0_7_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_7_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_7_state, "Tempo-BPM")
    
                
            



        N_n_0_35_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_35_state, m)
        }
        N_n_0_35_state.messageSender = N_n_0_35_snds_0
        NT_bang_setReceiveBusName(N_n_0_35_state, "empty")

        
    


            NT_add_setLeft(N_n_0_37_state, 0)
            NT_add_setRight(N_n_0_37_state, 88)
        




            N_n_0_41_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_41_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_41_state.msgSpecs[0].outTemplate = []

                N_n_0_41_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_41_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_41_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_41_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_41_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_41_state.msgSpecs[0].outMessage, 1, 1)
            
        



        N_n_0_43_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_43_state, 2)
    

            N_n_0_42_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_42_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_42_state.msgSpecs[0].outTemplate = []

                N_n_0_42_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_42_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_42_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_42_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_42_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_42_state.msgSpecs[0].outMessage, 1, 50)
            
        



            NT_float_setValue(N_n_9_3_state, 15000)
        

            NT_div_setLeft(N_n_0_10_state, 0)
            NT_div_setRight(N_n_0_10_state, 1)
        

            N_n_0_12_state.snd0 = N_n_0_13_rcvs_0
            N_n_0_12_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_12_state, 0)
            N_n_0_12_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_12_state)
            }
        

            NT_float_setValue(N_n_0_13_state, 0)
        

            NT_add_setLeft(N_n_0_14_state, 0)
            NT_add_setRight(N_n_0_14_state, 1)
        

            NT_mod_setLeft(N_n_0_15_state, 0)
            NT_mod_setRight(N_n_0_15_state, 16)
        

            N_n_0_17_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_0_17_state, m)
            }
            N_n_0_17_state.messageSender = N_n_ioSnd_n_0_17_0_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_0_17_state, "empty")
        


            NT_mod_setLeft(N_n_0_16_state, 0)
            NT_mod_setRight(N_n_0_16_state, 64)
        


            N_n_0_50_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_50_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_50_state.msgSpecs[0].outTemplate = []

                N_n_0_50_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_50_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_50_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_50_state.msgSpecs[0].outMessage, 0, 76)
            
        

            NT_add_setLeft(N_n_0_58_state, 0)
            NT_add_setRight(N_n_0_58_state, 0)
        




            NT_mul_setLeft(N_n_0_62_state, 0)
            NT_mul_setRight(N_n_0_62_state, 4)
        




        N_n_0_65_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_65_state, m)
        }
        N_n_0_65_state.messageSender = N_n_0_65_snds_0
        NT_bang_setReceiveBusName(N_n_0_65_state, "empty")

        
    

            N_n_0_67_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_67_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_67_state.msgSpecs[0].outTemplate = []

                N_n_0_67_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_67_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_67_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_67_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_67_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_67_state.msgSpecs[0].outMessage, 1, 2)
            
        



        N_n_0_69_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_69_state, 5)
    

            N_n_0_68_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_68_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_68_state.msgSpecs[0].outTemplate = []

                N_n_0_68_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_68_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_68_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_68_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_68_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_68_state.msgSpecs[0].outMessage, 1, 140)
            
        


            NT_float_setValue(N_n_0_77_state, 0)
        

            NT_eq_setLeft(N_n_0_78_state, 0)
            NT_eq_setRight(N_n_0_78_state, 0)
        


            N_n_0_80_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_80_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_80_state.msgSpecs[0].outTemplate = []

                N_n_0_80_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_80_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_80_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_80_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_80_state.msgSpecs[0].outMessage, 0, 0.3)
            

                G_msg_writeFloatToken(N_n_0_80_state.msgSpecs[0].outMessage, 1, 150)
            
        

            NT_line_setGrain(N_n_0_82_state, 20)
            N_n_0_82_state.snd0 = N_n_0_82_snds_0
            N_n_0_82_state.tickCallback = function () {
                NT_line_tick(N_n_0_82_state)
            }
        




            NT_float_setValue(N_n_10_3_state, 1)
        

            NT_sub_setLeft(N_n_0_84_state, 0)
            NT_sub_setRight(N_n_0_84_state, 0)
        




            N_n_0_81_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_81_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_81_state.msgSpecs[0].outTemplate = []

                N_n_0_81_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_81_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_81_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_81_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_81_state.msgSpecs[0].outMessage, 0, 0.7)
            

                G_msg_writeFloatToken(N_n_0_81_state.msgSpecs[0].outMessage, 1, 150)
            
        


            N_n_0_52_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_52_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_52_state.msgSpecs[0].outTemplate = []

                N_n_0_52_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_52_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_52_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_52_state.msgSpecs[0].outMessage, 0, 79)
            
        


            N_n_0_54_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_54_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_54_state.msgSpecs[0].outTemplate = []

                N_n_0_54_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_54_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_54_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_54_state.msgSpecs[0].outMessage, 0, 83)
            
        


            N_n_0_53_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_53_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_53_state.msgSpecs[0].outTemplate = []

                N_n_0_53_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_53_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_53_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_53_state.msgSpecs[0].outMessage, 0, 81)
            
        


            N_n_0_51_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_51_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_51_state.msgSpecs[0].outTemplate = []

                N_n_0_51_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_51_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_51_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_51_state.msgSpecs[0].outMessage, 0, 77)
            
        


            N_n_0_55_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_55_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_55_state.msgSpecs[0].outTemplate = []

                N_n_0_55_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_55_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_55_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_55_state.msgSpecs[0].outMessage, 0, 84)
            
        


            N_n_0_56_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_56_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_56_state.msgSpecs[0].outTemplate = []

                N_n_0_56_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_56_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_56_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_56_state.msgSpecs[0].outMessage, 0, 86)
            
        


            N_n_0_57_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_57_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_57_state.msgSpecs[0].outTemplate = []

                N_n_0_57_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_57_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_57_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_57_state.msgSpecs[0].outMessage, 0, 88)
            
        



            N_n_0_89_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_89_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_89_state.msgSpecs[0].outTemplate = []

                N_n_0_89_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_89_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_89_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_89_state.msgSpecs[0].outMessage, 0, 48)
            
        

            NT_add_setLeft(N_n_0_93_state, 0)
            NT_add_setRight(N_n_0_93_state, 0)
        





            N_n_0_96_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_96_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_96_state.msgSpecs[0].outTemplate = []

                N_n_0_96_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_96_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_96_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_96_state.msgSpecs[0].outMessage, 0, 55)
            
        

            NT_add_setLeft(N_n_0_100_state, 0)
            NT_add_setRight(N_n_0_100_state, 0)
        





            N_n_0_103_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_103_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_103_state.msgSpecs[0].outTemplate = []

                N_n_0_103_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_103_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_103_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_103_state.msgSpecs[0].outMessage, 0, 59)
            
        

            NT_add_setLeft(N_n_0_107_state, 0)
            NT_add_setRight(N_n_0_107_state, 0)
        





        N_n_0_112_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_112_state, m)
        }
        N_n_0_112_state.messageSender = N_n_0_112_snds_0
        NT_bang_setReceiveBusName(N_n_0_112_state, "empty")

        
    

        N_n_0_115_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_115_state, 100)
    

            N_n_0_114_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_114_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_114_state.msgSpecs[0].outTemplate = []

                N_n_0_114_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_114_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_114_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_114_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_114_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_114_state.msgSpecs[0].outMessage, 1, 800)
            
        



        N_n_0_117_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_117_state, 7000)
    

            N_n_0_116_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_116_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_116_state.msgSpecs[0].outTemplate = []

                N_n_0_116_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_116_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_116_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_116_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_116_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_116_state.msgSpecs[0].outMessage, 1, 1500)
            
        


            N_n_0_90_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_90_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_90_state.msgSpecs[0].outTemplate = []

                N_n_0_90_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_90_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_90_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_90_state.msgSpecs[0].outMessage, 0, 53)
            
        


            N_n_0_97_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_97_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_97_state.msgSpecs[0].outTemplate = []

                N_n_0_97_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_97_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_97_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_97_state.msgSpecs[0].outMessage, 0, 57)
            
        


            N_n_0_104_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_104_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_104_state.msgSpecs[0].outTemplate = []

                N_n_0_104_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_104_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_104_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_104_state.msgSpecs[0].outMessage, 0, 64)
            
        


            N_n_0_91_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_91_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_91_state.msgSpecs[0].outTemplate = []

                N_n_0_91_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_91_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_91_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_91_state.msgSpecs[0].outMessage, 0, 45)
            
        


            N_n_0_98_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_98_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_98_state.msgSpecs[0].outTemplate = []

                N_n_0_98_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_98_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_98_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_98_state.msgSpecs[0].outMessage, 0, 52)
            
        


            N_n_0_105_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_105_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_105_state.msgSpecs[0].outTemplate = []

                N_n_0_105_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_105_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_105_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_105_state.msgSpecs[0].outMessage, 0, 57)
            
        


            N_n_0_92_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_92_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_92_state.msgSpecs[0].outTemplate = []

                N_n_0_92_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_92_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_92_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_92_state.msgSpecs[0].outMessage, 0, 43)
            
        


            N_n_0_99_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_99_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_99_state.msgSpecs[0].outTemplate = []

                N_n_0_99_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_99_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_99_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_99_state.msgSpecs[0].outMessage, 0, 50)
            
        


            N_n_0_106_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_106_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_106_state.msgSpecs[0].outTemplate = []

                N_n_0_106_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_106_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_106_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_106_state.msgSpecs[0].outMessage, 0, 59)
            
        



            N_n_0_125_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_125_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_125_state.msgSpecs[0].outTemplate = []

                N_n_0_125_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_125_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_125_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_125_state.msgSpecs[0].outMessage, 0, 36)
            
        

            NT_add_setLeft(N_n_0_128_state, 0)
            NT_add_setRight(N_n_0_128_state, 0)
        





        N_n_0_132_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_132_state, m)
        }
        N_n_0_132_state.messageSender = N_n_0_132_snds_0
        NT_bang_setReceiveBusName(N_n_0_132_state, "empty")

        
    

            N_n_0_134_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_134_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_134_state.msgSpecs[0].outTemplate = []

                N_n_0_134_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_134_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_134_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_134_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_134_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_134_state.msgSpecs[0].outMessage, 1, 10)
            
        



        N_n_0_136_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_136_state, 50)
    

            N_n_0_135_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_135_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_135_state.msgSpecs[0].outTemplate = []

                N_n_0_135_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_135_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_135_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_135_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_135_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_135_state.msgSpecs[0].outMessage, 1, 160)
            
        


            N_n_0_126_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_126_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_126_state.msgSpecs[0].outTemplate = []

                N_n_0_126_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_126_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_126_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_126_state.msgSpecs[0].outMessage, 0, 33)
            
        


            N_n_0_127_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_127_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_127_state.msgSpecs[0].outTemplate = []

                N_n_0_127_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_127_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_127_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_127_state.msgSpecs[0].outMessage, 0, 31)
            
        



        N_n_0_249_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_249_state, m)
        }
        N_n_0_249_state.messageSender = N_n_0_249_snds_0
        NT_bang_setReceiveBusName(N_n_0_249_state, "empty")

        
    

            N_n_0_251_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_251_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_251_state.msgSpecs[0].outTemplate = []

                N_n_0_251_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_251_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_251_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_251_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_251_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_251_state.msgSpecs[0].outMessage, 1, 6)
            
        



        N_n_0_253_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_253_state, 15)
    

            N_n_0_252_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_252_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_252_state.msgSpecs[0].outTemplate = []

                N_n_0_252_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_252_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_252_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_252_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_252_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_252_state.msgSpecs[0].outMessage, 1, 150)
            
        



        N_n_0_258_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_258_state, m)
        }
        N_n_0_258_state.messageSender = N_n_0_258_snds_0
        NT_bang_setReceiveBusName(N_n_0_258_state, "empty")

        
    

            N_n_0_260_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_260_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_260_state.msgSpecs[0].outTemplate = []

                N_n_0_260_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_260_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_260_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_260_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_260_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_260_state.msgSpecs[0].outMessage, 1, 2)
            
        



        N_n_0_262_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_262_state, 2)
    

            N_n_0_261_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_261_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_261_state.msgSpecs[0].outTemplate = []

                N_n_0_261_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_261_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_261_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_261_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_261_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_261_state.msgSpecs[0].outMessage, 1, 50)
            
        



        N_n_0_268_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_268_state, m)
        }
        N_n_0_268_state.messageSender = N_n_0_268_snds_0
        NT_bang_setReceiveBusName(N_n_0_268_state, "empty")

        
    

            N_n_0_270_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_270_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_270_state.msgSpecs[0].outTemplate = []

                N_n_0_270_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_270_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_270_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_270_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_270_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_270_state.msgSpecs[0].outMessage, 1, 1)
            
        



        N_n_0_272_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_272_state, 1)
    

            N_n_0_271_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_271_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_271_state.msgSpecs[0].outTemplate = []

                N_n_0_271_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_271_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_271_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_271_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_271_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_271_state.msgSpecs[0].outMessage, 1, 25)
            
        



        N_n_0_293_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_293_state, m)
        }
        N_n_0_293_state.messageSender = N_n_0_297_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_293_state, "empty")

        
    

        if (N_n_0_297_state.arrayName.length) {
            NT_tabplay_t_setArrayName(
                N_n_0_297_state, 
                N_n_0_297_state.arrayName,
                () => NT_tabplay_t_setArrayNameFinalize(N_n_0_297_state)
            )
        }
    


        N_n_0_294_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_294_state, m)
        }
        N_n_0_294_state.messageSender = N_n_0_298_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_294_state, "empty")

        
    

        if (N_n_0_298_state.arrayName.length) {
            NT_tabplay_t_setArrayName(
                N_n_0_298_state, 
                N_n_0_298_state.arrayName,
                () => NT_tabplay_t_setArrayNameFinalize(N_n_0_298_state)
            )
        }
    


        N_n_0_295_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_295_state, m)
        }
        N_n_0_295_state.messageSender = N_n_0_299_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_295_state, "empty")

        
    

        if (N_n_0_299_state.arrayName.length) {
            NT_tabplay_t_setArrayName(
                N_n_0_299_state, 
                N_n_0_299_state.arrayName,
                () => NT_tabplay_t_setArrayNameFinalize(N_n_0_299_state)
            )
        }
    


        N_n_0_296_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_296_state, m)
        }
        N_n_0_296_state.messageSender = N_n_0_300_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_296_state, "empty")

        
    

        if (N_n_0_300_state.arrayName.length) {
            NT_tabplay_t_setArrayName(
                N_n_0_300_state, 
                N_n_0_300_state.arrayName,
                () => NT_tabplay_t_setArrayNameFinalize(N_n_0_300_state)
            )
        }
    

            NT_mod_setLeft(N_n_0_205_state, 0)
            NT_mod_setRight(N_n_0_205_state, 32)
        


            NT_float_setValue(N_n_0_207_state, 0)
        

            NT_eq_setLeft(N_n_0_208_state, 0)
            NT_eq_setRight(N_n_0_208_state, 0)
        


        N_n_0_210_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_210_state, 45)
    

        N_n_0_211_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_211_state, 45)
    

        N_n_0_212_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_212_state, 45)
    

        N_n_0_213_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_213_state, 45)
    

        N_n_0_214_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_214_state, 45)
    

            N_n_0_225_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_225_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_225_state.msgSpecs[0].outTemplate = []

                N_n_0_225_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_225_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_225_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_225_state.msgSpecs[0].outMessage, 0, 103)
            
        

            NT_add_setLeft(N_n_0_226_state, 0)
            NT_add_setRight(N_n_0_226_state, 0)
        




            NT_mul_setLeft(N_n_0_229_state, 0)
            NT_mul_setRight(N_n_0_229_state, 3)
        




        N_n_0_233_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_233_state, m)
        }
        N_n_0_233_state.messageSender = N_n_0_233_snds_0
        NT_bang_setReceiveBusName(N_n_0_233_state, "empty")

        
    

            N_n_0_235_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_235_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_235_state.msgSpecs[0].outTemplate = []

                N_n_0_235_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_235_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_235_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_235_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_235_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_235_state.msgSpecs[0].outMessage, 1, 2)
            
        



        N_n_0_237_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_237_state, 5)
    

            N_n_0_236_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_236_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_236_state.msgSpecs[0].outTemplate = []

                N_n_0_236_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_236_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_236_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_236_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_236_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_236_state.msgSpecs[0].outMessage, 1, 80)
            
        


            N_n_0_224_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_224_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_224_state.msgSpecs[0].outTemplate = []

                N_n_0_224_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_224_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_224_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_224_state.msgSpecs[0].outMessage, 0, 100)
            
        


            N_n_0_223_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_223_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_223_state.msgSpecs[0].outTemplate = []

                N_n_0_223_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_223_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_223_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_223_state.msgSpecs[0].outMessage, 0, 98)
            
        


            N_n_0_222_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_222_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_222_state.msgSpecs[0].outTemplate = []

                N_n_0_222_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_222_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_222_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_222_state.msgSpecs[0].outMessage, 0, 96)
            
        


            N_n_0_221_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_221_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_221_state.msgSpecs[0].outTemplate = []

                N_n_0_221_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_221_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_221_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_221_state.msgSpecs[0].outMessage, 0, 93)
            
        


            N_n_0_220_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_220_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_220_state.msgSpecs[0].outTemplate = []

                N_n_0_220_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_220_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_220_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_220_state.msgSpecs[0].outMessage, 0, 91)
            
        


            N_n_0_240_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_240_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_240_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_240_state.msgSpecs[0].outTemplate = []

                N_n_0_240_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_240_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_240_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_240_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_240_state.msgSpecs[0].outMessage, 0, 0.1)
            

                G_msg_writeFloatToken(N_n_0_240_state.msgSpecs[0].outMessage, 1, 0)
            

        
        
        
    
N_n_0_240_state.msgSpecs[1].outTemplate = []

                N_n_0_240_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_240_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_240_state.msgSpecs[1].outMessage = G_msg_create(N_n_0_240_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_0_240_state.msgSpecs[1].outMessage, 0, 0.9)
            

                G_msg_writeFloatToken(N_n_0_240_state.msgSpecs[1].outMessage, 1, 250)
            
        

            NT_line_setGrain(N_n_0_242_state, 20)
            N_n_0_242_state.snd0 = N_n_0_242_snds_0
            N_n_0_242_state.tickCallback = function () {
                NT_line_tick(N_n_0_242_state)
            }
        




            NT_float_setValue(N_n_13_3_state, 1)
        

            NT_sub_setLeft(N_n_0_244_state, 0)
            NT_sub_setRight(N_n_0_244_state, 0)
        




        N_n_0_215_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_215_state, 45)
    

        N_n_0_216_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_216_state, 45)
    

        N_n_0_217_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_217_state, 45)
    

        N_n_0_218_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_218_state, 45)
    

        N_n_0_219_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_219_state, 45)
    

            N_n_0_241_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_241_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_241_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_241_state.msgSpecs[0].outTemplate = []

                N_n_0_241_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_241_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_241_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_241_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_241_state.msgSpecs[0].outMessage, 0, 0.9)
            

                G_msg_writeFloatToken(N_n_0_241_state.msgSpecs[0].outMessage, 1, 0)
            

        
        
        
    
N_n_0_241_state.msgSpecs[1].outTemplate = []

                N_n_0_241_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_241_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_241_state.msgSpecs[1].outMessage = G_msg_create(N_n_0_241_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_0_241_state.msgSpecs[1].outMessage, 0, 0.1)
            

                G_msg_writeFloatToken(N_n_0_241_state.msgSpecs[1].outMessage, 1, 250)
            
        




            N_n_0_11_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_11_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_11_state.msgSpecs[0].outTemplate = []

                N_n_0_11_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_11_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_11_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_11_state.msgSpecs[0].outMessage, 0, 1)
            
        

            N_n_0_144_state.snd0 = N_n_0_145_rcvs_0
            N_n_0_144_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_144_state, 6000)
            N_n_0_144_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_144_state)
            }
        


            NT_add_setLeft(N_n_0_146_state, 0)
            NT_add_setRight(N_n_0_146_state, 180)
        

            N_n_0_147_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_147_state.msgSpecs[0].outTemplate = []

                N_n_0_147_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_147_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_147_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_147_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_147_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_147_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_147_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_147_state.msgSpecs[0].outMessage, 1, 5500)
            
                            return N_n_0_147_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_0_148_state, 20)
            N_n_0_148_state.snd0 = N_m_n_0_143_1__routemsg_rcvs_0
            N_n_0_148_state.tickCallback = function () {
                NT_line_tick(N_n_0_148_state)
            }
        




            N_n_0_153_state.snd0 = N_n_0_154_rcvs_0
            N_n_0_153_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_153_state, 300)
            N_n_0_153_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_153_state)
            }
        




            NT_add_setLeft(N_n_0_157_state, 0)
            NT_add_setRight(N_n_0_157_state, 1100)
        



            N_n_0_161_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_161_state.msgSpecs[0].outTemplate = []

                N_n_0_161_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_161_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_0_161_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_161_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_161_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_161_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            
                            return N_n_0_161_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_161_state.msgSpecs[1].outTemplate = []

                N_n_0_161_state.msgSpecs[1].outTemplate.push(G_msg_getTokenType(inMessage, 1))
                if (G_msg_isStringToken(inMessage, 1)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 1)
                    N_n_0_161_state.msgSpecs[1].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_161_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_161_state.msgSpecs[1].outMessage = G_msg_create(N_n_0_161_state.msgSpecs[1].outTemplate)

                if (G_msg_isFloatToken(inMessage, 1)) {
                    G_msg_writeFloatToken(N_n_0_161_state.msgSpecs[1].outMessage, 0, G_msg_readFloatToken(inMessage, 1))
                } else if (G_msg_isStringToken(inMessage, 1)) {
                    G_msg_writeStringToken(N_n_0_161_state.msgSpecs[1].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_161_state.msgSpecs[1].outMessage, 1, 30)
            
                            return N_n_0_161_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_0_162_state, 20)
            N_n_0_162_state.snd0 = N_m_n_0_163_0__routemsg_rcvs_0
            N_n_0_162_state.tickCallback = function () {
                NT_line_tick(N_n_0_162_state)
            }
        




            NT_sub_setLeft(N_n_0_159_state, 0)
            NT_sub_setRight(N_n_0_159_state, 550)
        

            N_n_0_165_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_165_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_165_state.msgSpecs[0].outTemplate = []

                N_n_0_165_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_165_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_165_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_165_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_165_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_165_state.msgSpecs[0].outMessage, 1, 2)
            
        



        N_n_0_167_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_167_state, 2)
    

            N_n_0_166_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_166_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_166_state.msgSpecs[0].outTemplate = []

                N_n_0_166_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_166_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_166_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_166_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_166_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_166_state.msgSpecs[0].outMessage, 1, 35)
            
        



            NT_div_setLeft(N_n_0_172_state, 0)
            NT_div_setRight(N_n_0_172_state, 100)
        

            N_n_0_173_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_173_state.msgSpecs[0].outTemplate = []

                N_n_0_173_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_173_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_173_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_173_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_173_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_173_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_173_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_173_state.msgSpecs[0].outMessage, 1, 150)
            
                            return N_n_0_173_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_0_174_state, 20)
            N_n_0_174_state.snd0 = N_n_0_174_snds_0
            N_n_0_174_state.tickCallback = function () {
                NT_line_tick(N_n_0_174_state)
            }
        




            NT_float_setValue(N_n_11_3_state, 1)
        

            NT_sub_setLeft(N_n_0_176_state, 0)
            NT_sub_setRight(N_n_0_176_state, 0)
        




            N_n_0_179_state.snd0 = N_n_0_180_rcvs_0
            N_n_0_179_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_179_state, 100)
            N_n_0_179_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_179_state)
            }
        




            NT_add_setLeft(N_n_0_183_state, 0)
            NT_add_setRight(N_n_0_183_state, 500)
        



            N_n_0_187_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_187_state.msgSpecs[0].outTemplate = []

                N_n_0_187_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_187_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_0_187_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_187_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_187_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_187_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            
                            return N_n_0_187_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_187_state.msgSpecs[1].outTemplate = []

                N_n_0_187_state.msgSpecs[1].outTemplate.push(G_msg_getTokenType(inMessage, 1))
                if (G_msg_isStringToken(inMessage, 1)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 1)
                    N_n_0_187_state.msgSpecs[1].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_187_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_187_state.msgSpecs[1].outMessage = G_msg_create(N_n_0_187_state.msgSpecs[1].outTemplate)

                if (G_msg_isFloatToken(inMessage, 1)) {
                    G_msg_writeFloatToken(N_n_0_187_state.msgSpecs[1].outMessage, 0, G_msg_readFloatToken(inMessage, 1))
                } else if (G_msg_isStringToken(inMessage, 1)) {
                    G_msg_writeStringToken(N_n_0_187_state.msgSpecs[1].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_187_state.msgSpecs[1].outMessage, 1, 45)
            
                            return N_n_0_187_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_0_188_state, 20)
            N_n_0_188_state.snd0 = N_m_n_0_189_0__routemsg_rcvs_0
            N_n_0_188_state.tickCallback = function () {
                NT_line_tick(N_n_0_188_state)
            }
        




            NT_add_setLeft(N_n_0_185_state, 0)
            NT_add_setRight(N_n_0_185_state, 400)
        

            N_n_0_191_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_191_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_191_state.msgSpecs[0].outTemplate = []

                N_n_0_191_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_191_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_191_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_191_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_191_state.msgSpecs[0].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_0_191_state.msgSpecs[0].outMessage, 1, 2)
            
        



        N_n_0_193_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_193_state, 2)
    

            N_n_0_192_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_192_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_192_state.msgSpecs[0].outTemplate = []

                N_n_0_192_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_0_192_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_192_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_192_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_192_state.msgSpecs[0].outMessage, 0, 0)
            

                G_msg_writeFloatToken(N_n_0_192_state.msgSpecs[0].outMessage, 1, 45)
            
        



            NT_div_setLeft(N_n_0_198_state, 0)
            NT_div_setRight(N_n_0_198_state, 100)
        

            N_n_0_199_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_0_199_state.msgSpecs[0].outTemplate = []

                N_n_0_199_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_0_199_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            

                N_n_0_199_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_199_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_199_state.msgSpecs[0].outTemplate)

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_0_199_state.msgSpecs[0].outMessage, 0, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_0_199_state.msgSpecs[0].outMessage, 0, stringMem[0])
                }
            

                G_msg_writeFloatToken(N_n_0_199_state.msgSpecs[0].outMessage, 1, 150)
            
                            return N_n_0_199_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        

            NT_line_setGrain(N_n_0_200_state, 20)
            N_n_0_200_state.snd0 = N_n_0_200_snds_0
            N_n_0_200_state.tickCallback = function () {
                NT_line_tick(N_n_0_200_state)
            }
        




            NT_float_setValue(N_n_12_3_state, 1)
        

            NT_sub_setLeft(N_n_0_202_state, 0)
            NT_sub_setRight(N_n_0_202_state, 0)
        





            N_n_0_19_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_19_state.msgSpecs[0].outTemplate = []

                N_n_0_19_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_19_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_19_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_19_state.msgSpecs[0].outMessage, 0, 0)
            
        

                N_n_0_20_state.messageSender = N_n_0_20_snds_0
                N_n_0_20_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_20_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_20_state, "Transpose-Key")
    
                
            





            N_n_0_22_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_22_state.msgSpecs[0].outTemplate = []

                N_n_0_22_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_22_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_22_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_22_state.msgSpecs[0].outMessage, 0, 0.6)
            
        

                N_n_0_23_state.messageSender = N_n_0_23_snds_0
                N_n_0_23_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_23_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_23_state, "SFX-Volume")
    
                
            













            N_n_0_25_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_25_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_25_state.msgSpecs[0].outTemplate = []

                N_n_0_25_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_25_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_25_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_25_state.msgSpecs[0].outMessage, 0, 0.65)
            
        

                N_n_0_26_state.messageSender = N_n_0_26_snds_0
                N_n_0_26_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_26_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_26_state, "Delay-Feedback")
    
                
            





            N_n_0_28_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_28_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_28_state.msgSpecs[0].outTemplate = []

                N_n_0_28_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_0_28_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_28_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_0_28_state.msgSpecs[0].outMessage, 0, 0.22)
            
        

                N_n_0_29_state.messageSender = N_n_0_29_snds_0
                N_n_0_29_state.messageReceiver = function (m) {
                    NT_hsl_receiveMessage(N_n_0_29_state, m)
                }
                NT_hsl_setReceiveBusName(N_n_0_29_state, "Master-Gain")
    
                
            







            G_msgBuses_subscribe("Tempo-BPM", N_n_0_8_snds_0)
        


            G_msgBuses_subscribe("Transpose-Key", N_n_0_21_snds_0)
        


            G_msgBuses_subscribe("SFX-Volume", N_n_0_24_snds_0)
        


            G_msgBuses_subscribe("Delay-Feedback", N_n_0_27_snds_0)
        


            G_msgBuses_subscribe("Master-Gain", N_n_0_30_snds_0)
        

G_commons_waitFrame(0, () => N_n_0_283_rcvs_0(G_bangUtils_bang()))

        N_n_0_283_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_0_283_state, 100)
    

            N_n_0_284_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_284_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_284_state.msgSpecs[0].outTemplate = []

                N_n_0_284_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_284_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_0_284_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_284_state.msgSpecs[0].outTemplate.push(7)
            

                N_n_0_284_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_284_state.msgSpecs[0].outTemplate.push(14)
            

                N_n_0_284_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_284_state.msgSpecs[0].outTemplate.push(12)
            
N_n_0_284_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_284_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_284_state.msgSpecs[0].outMessage, 0, "read")
            

                G_msg_writeStringToken(N_n_0_284_state.msgSpecs[0].outMessage, 1, "-resize")
            

                G_msg_writeStringToken(N_n_0_284_state.msgSpecs[0].outMessage, 2, "cute-bloop.wav")
            

                G_msg_writeStringToken(N_n_0_284_state.msgSpecs[0].outMessage, 3, "sample_bloop")
            
        



            N_n_0_285_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_285_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_285_state.msgSpecs[0].outTemplate = []

                N_n_0_285_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_285_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_0_285_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_285_state.msgSpecs[0].outTemplate.push(7)
            

                N_n_0_285_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_285_state.msgSpecs[0].outTemplate.push(14)
            

                N_n_0_285_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_285_state.msgSpecs[0].outTemplate.push(12)
            
N_n_0_285_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_285_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_285_state.msgSpecs[0].outMessage, 0, "read")
            

                G_msg_writeStringToken(N_n_0_285_state.msgSpecs[0].outMessage, 1, "-resize")
            

                G_msg_writeStringToken(N_n_0_285_state.msgSpecs[0].outMessage, 2, "cute-water.wav")
            

                G_msg_writeStringToken(N_n_0_285_state.msgSpecs[0].outMessage, 3, "sample_water")
            
        


            N_n_0_286_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_286_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_286_state.msgSpecs[0].outTemplate = []

                N_n_0_286_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_286_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_0_286_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_286_state.msgSpecs[0].outTemplate.push(7)
            

                N_n_0_286_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_286_state.msgSpecs[0].outTemplate.push(12)
            

                N_n_0_286_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_286_state.msgSpecs[0].outTemplate.push(10)
            
N_n_0_286_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_286_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_286_state.msgSpecs[0].outMessage, 0, "read")
            

                G_msg_writeStringToken(N_n_0_286_state.msgSpecs[0].outMessage, 1, "-resize")
            

                G_msg_writeStringToken(N_n_0_286_state.msgSpecs[0].outMessage, 2, "cute-pop.wav")
            

                G_msg_writeStringToken(N_n_0_286_state.msgSpecs[0].outMessage, 3, "sample_pop")
            
        


            N_n_0_287_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_0_287_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_0_287_state.msgSpecs[0].outTemplate = []

                N_n_0_287_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_287_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_0_287_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_287_state.msgSpecs[0].outTemplate.push(7)
            

                N_n_0_287_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_287_state.msgSpecs[0].outTemplate.push(14)
            

                N_n_0_287_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_0_287_state.msgSpecs[0].outTemplate.push(12)
            
N_n_0_287_state.msgSpecs[0].outMessage = G_msg_create(N_n_0_287_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_0_287_state.msgSpecs[0].outMessage, 0, "read")
            

                G_msg_writeStringToken(N_n_0_287_state.msgSpecs[0].outMessage, 1, "-resize")
            

                G_msg_writeStringToken(N_n_0_287_state.msgSpecs[0].outMessage, 2, "cute-chirp.wav")
            

                G_msg_writeStringToken(N_n_0_287_state.msgSpecs[0].outMessage, 3, "sample_chirp")
            
        












































































            NT_osc_t_setStep(N_n_0_60_state, 0)
        

            NT_osc_t_setStep(N_n_0_61_state, 0)
        






        N_n_0_72_state.setDelayNameCallback = function (_) {
            N_n_0_72_state.buffer = G_delayBuffers__BUFFERS.get(N_n_0_72_state.delayName)
            NT_delread_t_updateOffset(N_n_0_72_state)
        }

        if ("mallet-del".length) {
            NT_delread_t_setDelayName(N_n_0_72_state, "mallet-del", N_n_0_72_state.setDelayNameCallback)
        }
    


            NT_osc_t_setStep(N_n_0_228_state, 0)
        

            NT_osc_t_setStep(N_n_0_230_state, 0)
        








        N_n_0_71_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                600,
                "msec"
            )))
        )
        if ("mallet-del".length) {
            NT_delwrite_t_setDelayName(N_n_0_71_state, "mallet-del")
        }
    







            NT_osc_t_setStep(N_n_0_95_state, 0)
        

            NT_osc_t_setStep(N_n_0_102_state, 0)
        


            NT_osc_t_setStep(N_n_0_109_state, 0)
        


















            NT_osc_t_setStep(N_n_0_163_state, 0)
        








            NT_osc_t_setStep(N_n_0_254_state, 0)
        






        NT_filters_bp_t_updateCoefs(N_n_0_264_state)
    












            NT_osc_t_setStep(N_n_0_189_state, 0)
        









            NT_osc_t_setStep(N_n_0_130_state, 0)
        









            NT_osc_t_setStep(N_n_0_39_state, 0)
        































































                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
COLD_2(G_msg_EMPTY_MESSAGE)
COLD_3(G_msg_EMPTY_MESSAGE)
COLD_4(G_msg_EMPTY_MESSAGE)
COLD_5(G_msg_EMPTY_MESSAGE)
COLD_6(G_msg_EMPTY_MESSAGE)
COLD_7(G_msg_EMPTY_MESSAGE)
COLD_8(G_msg_EMPTY_MESSAGE)
COLD_9(G_msg_EMPTY_MESSAGE)
COLD_10(G_msg_EMPTY_MESSAGE)
COLD_11(G_msg_EMPTY_MESSAGE)
COLD_12(G_msg_EMPTY_MESSAGE)
COLD_13(G_msg_EMPTY_MESSAGE)
COLD_14(G_msg_EMPTY_MESSAGE)
COLD_15(G_msg_EMPTY_MESSAGE)
COLD_16(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            
                N_n_0_60_outs_0 = Math.cos(N_n_0_60_state.phase)
                N_n_0_60_state.phase += N_n_0_60_state.step
            

                N_n_0_61_outs_0 = Math.cos(N_n_0_61_state.phase)
                N_n_0_61_state.phase += N_n_0_61_state.step
            

        N_n_0_66_outs_0 = N_n_0_66_state.currentValue
        if (toFloat(FRAME) < N_n_0_66_state.currentLine.p1.x) {
            N_n_0_66_state.currentValue += N_n_0_66_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_66_state.currentLine.p1.x) {
                N_n_0_66_state.currentValue = N_n_0_66_state.currentLine.p1.y
            }
        }
    
N_n_0_70_outs_0 = (N_n_0_60_outs_0 + (N_n_0_61_outs_0 * (N_m_n_0_63_1_sig_state.currentValue))) * N_n_0_66_outs_0
N_n_0_72_outs_0 = G_buf_readSample(N_n_0_72_state.buffer, N_n_0_72_state.offset)

                N_n_0_228_outs_0 = Math.cos(N_n_0_228_state.phase)
                N_n_0_228_state.phase += N_n_0_228_state.step
            

                N_n_0_230_outs_0 = Math.cos(N_n_0_230_state.phase)
                N_n_0_230_state.phase += N_n_0_230_state.step
            

        N_n_0_234_outs_0 = N_n_0_234_state.currentValue
        if (toFloat(FRAME) < N_n_0_234_state.currentLine.p1.x) {
            N_n_0_234_state.currentValue += N_n_0_234_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_234_state.currentLine.p1.x) {
                N_n_0_234_state.currentValue = N_n_0_234_state.currentLine.p1.y
            }
        }
    
N_n_0_239_outs_0 = ((N_n_0_228_outs_0 + (N_n_0_230_outs_0 * (N_m_n_0_231_1_sig_state.currentValue))) * N_n_0_234_outs_0) * (N_m_n_0_239_1_sig_state.currentValue)
G_buf_writeSample(N_n_0_71_state.buffer, (N_n_0_70_outs_0 + (N_n_0_72_outs_0 * (N_m_n_0_73_1_sig_state.currentValue)) + N_n_0_239_outs_0))
N_n_0_76_outs_0 = (N_n_0_70_outs_0 + (N_n_0_72_outs_0 * (N_m_n_0_74_1_sig_state.currentValue))) * (N_m_n_0_76_1_sig_state.currentValue)

                N_n_0_95_outs_0 = Math.cos(N_n_0_95_state.phase)
                N_n_0_95_state.phase += N_n_0_95_state.step
            

                N_n_0_102_outs_0 = Math.cos(N_n_0_102_state.phase)
                N_n_0_102_state.phase += N_n_0_102_state.step
            

                N_n_0_109_outs_0 = Math.cos(N_n_0_109_state.phase)
                N_n_0_109_state.phase += N_n_0_109_state.step
            

        N_n_0_113_outs_0 = N_n_0_113_state.currentValue
        if (toFloat(FRAME) < N_n_0_113_state.currentLine.p1.x) {
            N_n_0_113_state.currentValue += N_n_0_113_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_113_state.currentLine.p1.x) {
                N_n_0_113_state.currentValue = N_n_0_113_state.currentLine.p1.y
            }
        }
    
N_n_0_119_state.previous = N_n_0_119_outs_0 = N_n_0_119_state.coeff * (((N_n_0_95_outs_0 + N_n_0_102_outs_0) + N_n_0_109_outs_0) * N_n_0_113_outs_0) + (1 - N_n_0_119_state.coeff) * N_n_0_119_state.previous
N_n_0_120_outs_0 = N_n_0_119_outs_0 * (N_m_n_0_120_1_sig_state.currentValue)
N_n_0_143_state.previous = N_n_0_143_outs_0 = N_n_0_143_state.coeff * (Math.random() * 2 - 1) + (1 - N_n_0_143_state.coeff) * N_n_0_143_state.previous
N_n_0_150_outs_0 = (N_n_0_143_outs_0 * (N_m_n_0_149_1_sig_state.currentValue)) * (N_m_n_0_150_1_sig_state.currentValue)

                N_n_0_163_outs_0 = Math.cos(N_n_0_163_state.phase)
                N_n_0_163_state.phase += N_n_0_163_state.step
            

        N_n_0_164_outs_0 = N_n_0_164_state.currentValue
        if (toFloat(FRAME) < N_n_0_164_state.currentLine.p1.x) {
            N_n_0_164_state.currentValue += N_n_0_164_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_164_state.currentLine.p1.x) {
                N_n_0_164_state.currentValue = N_n_0_164_state.currentLine.p1.y
            }
        }
    
N_n_0_170_outs_0 = ((N_n_0_163_outs_0 * N_n_0_164_outs_0) * (N_m_n_0_169_1_sig_state.currentValue)) * (N_m_n_0_170_1_sig_state.currentValue)

                N_n_0_254_outs_0 = Math.cos(N_n_0_254_state.phase)
                N_n_0_254_state.phase += N_n_0_254_state.step
            

        N_n_0_250_outs_0 = N_n_0_250_state.currentValue
        if (toFloat(FRAME) < N_n_0_250_state.currentLine.p1.x) {
            N_n_0_250_state.currentValue += N_n_0_250_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_250_state.currentLine.p1.x) {
                N_n_0_250_state.currentValue = N_n_0_250_state.currentLine.p1.y
            }
        }
    
N_n_0_256_outs_0 = (N_n_0_254_outs_0 * N_n_0_250_outs_0) * (N_m_n_0_256_1_sig_state.currentValue)

        N_n_0_264_state.y = (Math.random() * 2 - 1) + N_n_0_264_state.coef1 * N_n_0_264_state.ym1 + N_n_0_264_state.coef2 * N_n_0_264_state.ym2
        N_n_0_264_outs_0 = N_n_0_264_state.gain * N_n_0_264_state.y
        N_n_0_264_state.ym2 = N_n_0_264_state.ym1
        N_n_0_264_state.ym1 = N_n_0_264_state.y
    

        N_n_0_259_outs_0 = N_n_0_259_state.currentValue
        if (toFloat(FRAME) < N_n_0_259_state.currentLine.p1.x) {
            N_n_0_259_state.currentValue += N_n_0_259_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_259_state.currentLine.p1.x) {
                N_n_0_259_state.currentValue = N_n_0_259_state.currentLine.p1.y
            }
        }
    
N_n_0_266_outs_0 = (N_n_0_264_outs_0 * N_n_0_259_outs_0) * (N_m_n_0_266_1_sig_state.currentValue)

            N_n_0_274_state.current = (Math.random() * 2 - 1) + N_n_0_274_state.coeff * N_n_0_274_state.previous
            N_n_0_274_outs_0 = N_n_0_274_state.normal * (N_n_0_274_state.current - N_n_0_274_state.previous)
            N_n_0_274_state.previous = N_n_0_274_state.current
        

        N_n_0_269_outs_0 = N_n_0_269_state.currentValue
        if (toFloat(FRAME) < N_n_0_269_state.currentLine.p1.x) {
            N_n_0_269_state.currentValue += N_n_0_269_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_269_state.currentLine.p1.x) {
                N_n_0_269_state.currentValue = N_n_0_269_state.currentLine.p1.y
            }
        }
    
N_n_0_276_outs_0 = (N_n_0_274_outs_0 * N_n_0_269_outs_0) * (N_m_n_0_276_1_sig_state.currentValue)

                N_n_0_189_outs_0 = Math.cos(N_n_0_189_state.phase)
                N_n_0_189_state.phase += N_n_0_189_state.step
            

        N_n_0_190_outs_0 = N_n_0_190_state.currentValue
        if (toFloat(FRAME) < N_n_0_190_state.currentLine.p1.x) {
            N_n_0_190_state.currentValue += N_n_0_190_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_190_state.currentLine.p1.x) {
                N_n_0_190_state.currentValue = N_n_0_190_state.currentLine.p1.y
            }
        }
    
N_n_0_196_outs_0 = ((N_n_0_189_outs_0 * N_n_0_190_outs_0) * (N_m_n_0_195_1_sig_state.currentValue)) * (N_m_n_0_196_1_sig_state.currentValue)

                N_n_0_130_outs_0 = Math.cos(N_n_0_130_state.phase)
                N_n_0_130_state.phase += N_n_0_130_state.step
            
N_n_0_131_state.previous = N_n_0_131_outs_0 = N_n_0_131_state.coeff * N_n_0_130_outs_0 + (1 - N_n_0_131_state.coeff) * N_n_0_131_state.previous

        N_n_0_133_outs_0 = N_n_0_133_state.currentValue
        if (toFloat(FRAME) < N_n_0_133_state.currentLine.p1.x) {
            N_n_0_133_state.currentValue += N_n_0_133_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_133_state.currentLine.p1.x) {
                N_n_0_133_state.currentValue = N_n_0_133_state.currentLine.p1.y
            }
        }
    
N_n_0_138_outs_0 = (N_n_0_131_outs_0 * N_n_0_133_outs_0) * (N_m_n_0_138_1_sig_state.currentValue)

                N_n_0_39_outs_0 = Math.cos(N_n_0_39_state.phase)
                N_n_0_39_state.phase += N_n_0_39_state.step
            

        N_n_0_40_outs_0 = N_n_0_40_state.currentValue
        if (toFloat(FRAME) < N_n_0_40_state.currentLine.p1.x) {
            N_n_0_40_state.currentValue += N_n_0_40_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_40_state.currentLine.p1.x) {
                N_n_0_40_state.currentValue = N_n_0_40_state.currentLine.p1.y
            }
        }
    
N_n_0_45_outs_0 = (N_n_0_39_outs_0 * N_n_0_40_outs_0) * (N_m_n_0_45_1_sig_state.currentValue)

        if (N_n_0_297_state.readPosition < N_n_0_297_state.readUntil) {
            N_n_0_297_outs_0 = N_n_0_297_state.array[N_n_0_297_state.readPosition]
            N_n_0_297_state.readPosition++
            if (N_n_0_297_state.readPosition >= N_n_0_297_state.readUntil) {
                G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_bang())
            }
        } else {
            N_n_0_297_outs_0 = 0
        }
    

        if (N_n_0_298_state.readPosition < N_n_0_298_state.readUntil) {
            N_n_0_298_outs_0 = N_n_0_298_state.array[N_n_0_298_state.readPosition]
            N_n_0_298_state.readPosition++
            if (N_n_0_298_state.readPosition >= N_n_0_298_state.readUntil) {
                G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_bang())
            }
        } else {
            N_n_0_298_outs_0 = 0
        }
    

        if (N_n_0_299_state.readPosition < N_n_0_299_state.readUntil) {
            N_n_0_299_outs_0 = N_n_0_299_state.array[N_n_0_299_state.readPosition]
            N_n_0_299_state.readPosition++
            if (N_n_0_299_state.readPosition >= N_n_0_299_state.readUntil) {
                G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_bang())
            }
        } else {
            N_n_0_299_outs_0 = 0
        }
    

        if (N_n_0_300_state.readPosition < N_n_0_300_state.readUntil) {
            N_n_0_300_outs_0 = N_n_0_300_state.array[N_n_0_300_state.readPosition]
            N_n_0_300_state.readPosition++
            if (N_n_0_300_state.readPosition >= N_n_0_300_state.readUntil) {
                G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_bang())
            }
        } else {
            N_n_0_300_outs_0 = 0
        }
    
OUTPUT[0][IT_FRAME] = ((Math.max(Math.min(N_n_0_342_state.maxValue, ((((((((((((N_n_0_76_outs_0 * (N_m_n_0_85_1_sig_state.currentValue)) + (N_n_0_120_outs_0 * (N_m_n_0_121_1_sig_state.currentValue))) + (N_n_0_150_outs_0 * (N_m_n_0_151_1_sig_state.currentValue))) + (N_n_0_170_outs_0 * (N_m_n_0_177_1_sig_state.currentValue))) + N_n_0_256_outs_0) + N_n_0_266_outs_0) + N_n_0_276_outs_0) + (N_n_0_196_outs_0 * (N_m_n_0_203_1_sig_state.currentValue))) + (N_n_0_239_outs_0 * (N_m_n_0_245_1_sig_state.currentValue))) + (N_n_0_138_outs_0 * (N_m_n_0_139_1_sig_state.currentValue))) + (N_n_0_45_outs_0 * (N_m_n_0_46_1_sig_state.currentValue))) + ((((((N_n_0_297_outs_0 * (N_m_n_0_301_1_sig_state.currentValue)) + (N_n_0_298_outs_0 * (N_m_n_0_303_1_sig_state.currentValue))) + (N_n_0_299_outs_0 * (N_m_n_0_305_1_sig_state.currentValue))) + (N_n_0_300_outs_0 * (N_m_n_0_307_1_sig_state.currentValue))) * (N_m_n_0_315_1_sig_state.currentValue)) * (N_m_n_0_317_1_sig_state.currentValue)))), N_n_0_342_state.minValue)) * (N_m_n_0_344_1_sig_state.currentValue))
OUTPUT[1][IT_FRAME] = ((Math.max(Math.min(N_n_0_343_state.maxValue, ((((((((((((N_n_0_76_outs_0 * (N_m_n_0_86_1_sig_state.currentValue)) + (N_n_0_120_outs_0 * (N_m_n_0_122_1_sig_state.currentValue))) + (N_n_0_150_outs_0 * (N_m_n_0_152_1_sig_state.currentValue))) + (N_n_0_170_outs_0 * (N_m_n_0_178_1_sig_state.currentValue))) + N_n_0_256_outs_0) + N_n_0_266_outs_0) + N_n_0_276_outs_0) + (N_n_0_196_outs_0 * (N_m_n_0_204_1_sig_state.currentValue))) + (N_n_0_239_outs_0 * (N_m_n_0_246_1_sig_state.currentValue))) + (N_n_0_138_outs_0 * (N_m_n_0_140_1_sig_state.currentValue))) + (N_n_0_45_outs_0 * (N_m_n_0_47_1_sig_state.currentValue))) + ((((((N_n_0_297_outs_0 * (N_m_n_0_302_1_sig_state.currentValue)) + (N_n_0_298_outs_0 * (N_m_n_0_304_1_sig_state.currentValue))) + (N_n_0_299_outs_0 * (N_m_n_0_306_1_sig_state.currentValue))) + (N_n_0_300_outs_0 * (N_m_n_0_308_1_sig_state.currentValue))) * (N_m_n_0_316_1_sig_state.currentValue)) * (N_m_n_0_318_1_sig_state.currentValue)))), N_n_0_343_state.minValue)) * (N_m_n_0_345_1_sig_state.currentValue))
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_6: {
                            "0": IO_rcv_n_0_6_0,
                        },
n_0_7: {
                            "0": IO_rcv_n_0_7_0,
                        },
n_0_11: {
                            "0": IO_rcv_n_0_11_0,
                        },
n_0_17: {
                            "0": IO_rcv_n_0_17_0,
                        },
n_0_19: {
                            "0": IO_rcv_n_0_19_0,
                        },
n_0_20: {
                            "0": IO_rcv_n_0_20_0,
                        },
n_0_22: {
                            "0": IO_rcv_n_0_22_0,
                        },
n_0_23: {
                            "0": IO_rcv_n_0_23_0,
                        },
n_0_25: {
                            "0": IO_rcv_n_0_25_0,
                        },
n_0_26: {
                            "0": IO_rcv_n_0_26_0,
                        },
n_0_28: {
                            "0": IO_rcv_n_0_28_0,
                        },
n_0_29: {
                            "0": IO_rcv_n_0_29_0,
                        },
n_0_41: {
                            "0": IO_rcv_n_0_41_0,
                        },
n_0_42: {
                            "0": IO_rcv_n_0_42_0,
                        },
n_0_50: {
                            "0": IO_rcv_n_0_50_0,
                        },
n_0_51: {
                            "0": IO_rcv_n_0_51_0,
                        },
n_0_52: {
                            "0": IO_rcv_n_0_52_0,
                        },
n_0_53: {
                            "0": IO_rcv_n_0_53_0,
                        },
n_0_54: {
                            "0": IO_rcv_n_0_54_0,
                        },
n_0_55: {
                            "0": IO_rcv_n_0_55_0,
                        },
n_0_56: {
                            "0": IO_rcv_n_0_56_0,
                        },
n_0_57: {
                            "0": IO_rcv_n_0_57_0,
                        },
n_0_67: {
                            "0": IO_rcv_n_0_67_0,
                        },
n_0_68: {
                            "0": IO_rcv_n_0_68_0,
                        },
n_0_80: {
                            "0": IO_rcv_n_0_80_0,
                        },
n_0_81: {
                            "0": IO_rcv_n_0_81_0,
                        },
n_0_89: {
                            "0": IO_rcv_n_0_89_0,
                        },
n_0_90: {
                            "0": IO_rcv_n_0_90_0,
                        },
n_0_91: {
                            "0": IO_rcv_n_0_91_0,
                        },
n_0_92: {
                            "0": IO_rcv_n_0_92_0,
                        },
n_0_96: {
                            "0": IO_rcv_n_0_96_0,
                        },
n_0_97: {
                            "0": IO_rcv_n_0_97_0,
                        },
n_0_98: {
                            "0": IO_rcv_n_0_98_0,
                        },
n_0_99: {
                            "0": IO_rcv_n_0_99_0,
                        },
n_0_103: {
                            "0": IO_rcv_n_0_103_0,
                        },
n_0_104: {
                            "0": IO_rcv_n_0_104_0,
                        },
n_0_105: {
                            "0": IO_rcv_n_0_105_0,
                        },
n_0_106: {
                            "0": IO_rcv_n_0_106_0,
                        },
n_0_114: {
                            "0": IO_rcv_n_0_114_0,
                        },
n_0_116: {
                            "0": IO_rcv_n_0_116_0,
                        },
n_0_125: {
                            "0": IO_rcv_n_0_125_0,
                        },
n_0_126: {
                            "0": IO_rcv_n_0_126_0,
                        },
n_0_127: {
                            "0": IO_rcv_n_0_127_0,
                        },
n_0_134: {
                            "0": IO_rcv_n_0_134_0,
                        },
n_0_135: {
                            "0": IO_rcv_n_0_135_0,
                        },
n_0_147: {
                            "0": IO_rcv_n_0_147_0,
                        },
n_0_161: {
                            "0": IO_rcv_n_0_161_0,
                        },
n_0_165: {
                            "0": IO_rcv_n_0_165_0,
                        },
n_0_166: {
                            "0": IO_rcv_n_0_166_0,
                        },
n_0_173: {
                            "0": IO_rcv_n_0_173_0,
                        },
n_0_187: {
                            "0": IO_rcv_n_0_187_0,
                        },
n_0_191: {
                            "0": IO_rcv_n_0_191_0,
                        },
n_0_192: {
                            "0": IO_rcv_n_0_192_0,
                        },
n_0_199: {
                            "0": IO_rcv_n_0_199_0,
                        },
n_0_220: {
                            "0": IO_rcv_n_0_220_0,
                        },
n_0_221: {
                            "0": IO_rcv_n_0_221_0,
                        },
n_0_222: {
                            "0": IO_rcv_n_0_222_0,
                        },
n_0_223: {
                            "0": IO_rcv_n_0_223_0,
                        },
n_0_224: {
                            "0": IO_rcv_n_0_224_0,
                        },
n_0_225: {
                            "0": IO_rcv_n_0_225_0,
                        },
n_0_235: {
                            "0": IO_rcv_n_0_235_0,
                        },
n_0_236: {
                            "0": IO_rcv_n_0_236_0,
                        },
n_0_240: {
                            "0": IO_rcv_n_0_240_0,
                        },
n_0_241: {
                            "0": IO_rcv_n_0_241_0,
                        },
n_0_251: {
                            "0": IO_rcv_n_0_251_0,
                        },
n_0_252: {
                            "0": IO_rcv_n_0_252_0,
                        },
n_0_260: {
                            "0": IO_rcv_n_0_260_0,
                        },
n_0_261: {
                            "0": IO_rcv_n_0_261_0,
                        },
n_0_270: {
                            "0": IO_rcv_n_0_270_0,
                        },
n_0_271: {
                            "0": IO_rcv_n_0_271_0,
                        },
n_0_284: {
                            "0": IO_rcv_n_0_284_0,
                        },
n_0_285: {
                            "0": IO_rcv_n_0_285_0,
                        },
n_0_286: {
                            "0": IO_rcv_n_0_286_0,
                        },
n_0_287: {
                            "0": IO_rcv_n_0_287_0,
                        },
                },
                messageSenders: {
                    n_0_6: {
                            "0": () => undefined,
                        },
n_0_7: {
                            "0": () => undefined,
                        },
n_0_11: {
                            "0": () => undefined,
                        },
n_0_17: {
                            "0": () => undefined,
                        },
n_0_19: {
                            "0": () => undefined,
                        },
n_0_20: {
                            "0": () => undefined,
                        },
n_0_22: {
                            "0": () => undefined,
                        },
n_0_23: {
                            "0": () => undefined,
                        },
n_0_25: {
                            "0": () => undefined,
                        },
n_0_26: {
                            "0": () => undefined,
                        },
n_0_28: {
                            "0": () => undefined,
                        },
n_0_29: {
                            "0": () => undefined,
                        },
n_0_41: {
                            "0": () => undefined,
                        },
n_0_42: {
                            "0": () => undefined,
                        },
n_0_50: {
                            "0": () => undefined,
                        },
n_0_51: {
                            "0": () => undefined,
                        },
n_0_52: {
                            "0": () => undefined,
                        },
n_0_53: {
                            "0": () => undefined,
                        },
n_0_54: {
                            "0": () => undefined,
                        },
n_0_55: {
                            "0": () => undefined,
                        },
n_0_56: {
                            "0": () => undefined,
                        },
n_0_57: {
                            "0": () => undefined,
                        },
n_0_67: {
                            "0": () => undefined,
                        },
n_0_68: {
                            "0": () => undefined,
                        },
n_0_80: {
                            "0": () => undefined,
                        },
n_0_81: {
                            "0": () => undefined,
                        },
n_0_89: {
                            "0": () => undefined,
                        },
n_0_90: {
                            "0": () => undefined,
                        },
n_0_91: {
                            "0": () => undefined,
                        },
n_0_92: {
                            "0": () => undefined,
                        },
n_0_96: {
                            "0": () => undefined,
                        },
n_0_97: {
                            "0": () => undefined,
                        },
n_0_98: {
                            "0": () => undefined,
                        },
n_0_99: {
                            "0": () => undefined,
                        },
n_0_103: {
                            "0": () => undefined,
                        },
n_0_104: {
                            "0": () => undefined,
                        },
n_0_105: {
                            "0": () => undefined,
                        },
n_0_106: {
                            "0": () => undefined,
                        },
n_0_114: {
                            "0": () => undefined,
                        },
n_0_116: {
                            "0": () => undefined,
                        },
n_0_125: {
                            "0": () => undefined,
                        },
n_0_126: {
                            "0": () => undefined,
                        },
n_0_127: {
                            "0": () => undefined,
                        },
n_0_134: {
                            "0": () => undefined,
                        },
n_0_135: {
                            "0": () => undefined,
                        },
n_0_147: {
                            "0": () => undefined,
                        },
n_0_161: {
                            "0": () => undefined,
                        },
n_0_165: {
                            "0": () => undefined,
                        },
n_0_166: {
                            "0": () => undefined,
                        },
n_0_173: {
                            "0": () => undefined,
                        },
n_0_187: {
                            "0": () => undefined,
                        },
n_0_191: {
                            "0": () => undefined,
                        },
n_0_192: {
                            "0": () => undefined,
                        },
n_0_199: {
                            "0": () => undefined,
                        },
n_0_220: {
                            "0": () => undefined,
                        },
n_0_221: {
                            "0": () => undefined,
                        },
n_0_222: {
                            "0": () => undefined,
                        },
n_0_223: {
                            "0": () => undefined,
                        },
n_0_224: {
                            "0": () => undefined,
                        },
n_0_225: {
                            "0": () => undefined,
                        },
n_0_235: {
                            "0": () => undefined,
                        },
n_0_236: {
                            "0": () => undefined,
                        },
n_0_240: {
                            "0": () => undefined,
                        },
n_0_241: {
                            "0": () => undefined,
                        },
n_0_251: {
                            "0": () => undefined,
                        },
n_0_252: {
                            "0": () => undefined,
                        },
n_0_260: {
                            "0": () => undefined,
                        },
n_0_261: {
                            "0": () => undefined,
                        },
n_0_270: {
                            "0": () => undefined,
                        },
n_0_271: {
                            "0": () => undefined,
                        },
n_0_284: {
                            "0": () => undefined,
                        },
n_0_285: {
                            "0": () => undefined,
                        },
n_0_286: {
                            "0": () => undefined,
                        },
n_0_287: {
                            "0": () => undefined,
                        },
n_0_8: {
                            "0": () => undefined,
                        },
n_0_21: {
                            "0": () => undefined,
                        },
n_0_24: {
                            "0": () => undefined,
                        },
n_0_27: {
                            "0": () => undefined,
                        },
n_0_30: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
                exports.G_fs_i_readSoundFile = () => { throw new Error('import for G_fs_i_readSoundFile not provided') }
                const G_fs_i_readSoundFile = (...args) => exports.G_fs_i_readSoundFile(...args)
            

                exports.G_fs_i_writeSoundFile = () => { throw new Error('import for G_fs_i_writeSoundFile not provided') }
                const G_fs_i_writeSoundFile = (...args) => exports.G_fs_i_writeSoundFile(...args)
            
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
exports.G_fs_x_onReadSoundFileResponse = G_fs_x_onReadSoundFileResponse
exports.G_fs_x_onWriteSoundFileResponse = G_fs_x_onWriteSoundFileResponse
    