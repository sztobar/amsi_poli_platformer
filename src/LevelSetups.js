/**
 * Created by mmitis on 23.01.16.
 */
var IMAGES = require('./config').images;

module.exports =
{

    enemies: [
        {
            shoot: IMAGES.FARMER,
            walker: IMAGES.PIG,
            fly: IMAGES.COMPOST
        },
        {
            shoot: IMAGES.BIZNESMAN,
            walker: IMAGES.SKATEBOARD,
            fly: IMAGES.SMOG
        },
        {
            shoot: IMAGES.BOR,
            walker: IMAGES.JOURNALIST,
            fly: IMAGES.CORUPT
        },
        {
            shoot: IMAGES.MERKEL,
            walker: IMAGES.GRONKIEWICZ,
            fly: IMAGES.POPRAWNOSC
        }
    ]
}