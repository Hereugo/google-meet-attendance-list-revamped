'use strict'
{
    const prop = '[\\w$]{1,3}'
    const targetRegex = new RegExp(
        `^values\\(\\){return this\\.(${prop})\\.values\\(\\)}$`
    )

    let retries = 0;
    const maxRetries = 10000;

    const hooker = {
        getParticipants: function () {
            const data = [...this.map.values()]
            if (!this.dataPath) {
                for (const key in data[0]) {
                    for (const subKey in data[0][key]) {
                        const array = data[0][key][subKey]
                        if (
                            !Array.isArray(array) ||
                            !array[0]?.startsWith?.('spaces/')
                        ) {
                            continue
                        }
                        this.dataPath = [key, subKey]
                        Utils.log('Located participant data.')
                    }
                }
            }

            // BEST GUESSES
            // {
            //     0: their participant id
            //     1: the URL of their profile picture
            //     6: true if they are not the same account as the host, false otherwise
            //     7: true if they started the Meet (including presenters), false otherwise
            //     11: true if they are presenting, false otherwise
            //     12: true if they are the active presenter, false otherwise
            //     14: true if they started the Meet (excluding presenters), false otherwise
            //     15: true if they started the Meet and are presenting, false otherwise
            //     16: true if they are not presenting, false otherwise
            //     28: their full name
            //     29: 5 if they are in the Meet, 7 if they have left
            //     31: (present if presenting) the participant id of the presenting controller
            //     32: true if they are in the Meet, false otherwise
            //     33: true if they are in the Meet, false otherwise
            //     35: current time in seconds.
            //     36: (present if 45 excluding presenters) true if they are present and did not start the Meet, false otherwise
            //     37: their first name
            //     39: (present if 14 and not presenting) undefined
            //     45: true if they are the same account as the host, false otherwise
            //     51: 1 if they started the Meet (including presenters), 3 otherwise
            // }

            let res = data
                .map((obj) => obj[this.dataPath[0]][this.dataPath[1]])
                .filter((p) => p[7] && p[32] && p[33])
                .map((p) => { return {
                    'id': p[0],
                    'profile_url': p[1] || '',
                    'name': p[28] || 'John Doe',
                }});

            let hash = res.toSorted().reduce((acc, p) => acc + p.id || '', '');
            let hasUpdated = !(this.lastHash === hash);
            
            this.lastHash = hash;
    
            return {
                participants: res,
                hasUpdated,
            }
        }
    }

    const finder = setInterval(attemptHook, 1)

    function attemptHook() {
        try {
            for (const key in window.default_MeetingsUi) {
                const val = window.default_MeetingsUi[key]
                if (!val?.prototype) continue
                const getAll = Object.getOwnPropertyDescriptor(
                    val.prototype,
                    'getAll'
                )
                const values = Object.getOwnPropertyDescriptor(
                    val.prototype,
                    'values'
                )
                if (!getAll?.value || !values?.value) continue
                const match = values.value.toString().match(targetRegex)
                if (!match) continue
                hooker.target = values.value
                const og = val.prototype.values
                val.prototype.values = function () {
                    hooker.map = Object.values(this[match[1]]).find(
                        (map) =>
                            map instanceof Map &&
                            map.values().next()?.value?.name
                    )
                    val.prototype.values = og
                    return og.call(this)
                }
                Utils.log(`Successfully hooked into ${key}#values.`)
                clearInterval(finder)
                break
            }
        } catch (e) {
            console.error(e)
        }
        if (++retries == maxRetries) {
            Utils.log(
                `Unable to perform hook within ${maxRetries / 1000} seconds.`
            )
            clearInterval(finder)
        }
    }

    function sendUpdate() {
        let { participants, hasUpdated } = hooker.getParticipants();
        if (hasUpdated) {
            window.postMessage(
                {
                    participants,
                    sender: 'inject-message',
                },
                'https://meet.google.com'
            )
        }
    }

    setInterval(sendUpdate, 1000);

    window.hooker = hooker
}