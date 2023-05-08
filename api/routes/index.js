const express = require("express");
const router = express.Router();

const stylesController = require("../controllers/styles.controllers");

const mongoose = require('mongoose');
const Style = mongoose.model("Style");

// TODO: use env + move to controllers
router.route("/styles")
    // Get All
    .get(function(req, res){
        if(!req.query || !req.query.offset || !req.query.count){
            console.log("Request query params are missing (offset/count)");
            res.status(400).json({"message" : "Required query params offset/count are missing"});
            return;
        } else {
            const maxCount = 5;
            const offset = req.query.offset;
            const count = req.query.count;
            if(count > maxCount){
                console.log("Count is larger than max count allowed", maxCount);
                res.status(400).json({"message" : "Required query param count is larger than max count allowed " + maxCount});
                return;
            }
            Style.find().skip(offset).limit(offset+count).exec(function(err, foundStyles){
                const response = { status : 200, message: foundStyles};
                if(err){
                    console.log("Error finding styles");
                    response.status = 500;
                    response.message = err;
                } else {
                    console.log("Found styles");
                }
                res.status(response.status).json(response.message);
            });
        }
    })
    // Add One
    // TODO: add checkings and loggers
    .post(function(req, res){
        console.log("request body", req.body);
        const newStyle = {
            name: req.body.name,
            yearStarted : req.body.yearStarted,
            swimmers: []
        };
        Style.create(newStyle, function(err, style){
            res.status(201).json(style);
        });
    });

router.route("/styles/:styleId")
    // Get One
    // TODO: add checkings and loggers
    .get(function(req, res){
        const styleId = req.params.styleId;
        Style.findById(styleId).exec(function(err, foundStyle){
            res.status(200).json(foundStyle);
        });
    })
    .delete(function(req, res) {
        const styleId = req.params.styleId;
        Style.findByIdAndDelete(styleId).exec(function(err, deletedStyle){
            res.status(204).json(deletedStyle);
        });
    });

const _addSwimmer = function(req, res, style) {
    const newSwimmer = {
        name : req.body.name,
        firstUsed : req.body.firstUsed
    };
    style.swimmers.push(newSwimmer);
    style.save(function(err, updatedStyle){
        res.status(201).json(updatedStyle.swimmers);
    });
}

router.route("/styles/:styleId/swimmers")
    .get(function(req, res){
        const styleId = req.params.styleId;
        Style.findById(styleId).exec(function(err, foundStyle){
            res.status(200).json(foundStyle.swimmers);
        });
    })
    .post(function(req, res){
        const styleId = req.params.styleId;
        Style.findById(styleId).exec(function(err, foundStyle){
            _addSwimmer(req, res, foundStyle);
        });
    });

const _deleteSwimmer = function(req, res, style){
    const swimmerId = req.params.swimmerId;
    const foundSwimmer = style.swimmers.id(swimmerId);
    style.swimmers.pull(foundSwimmer);
    style.save(function(err, updateStyle){
        res.status(201).json(updateStyle.swimmers);
    });
}    

router.route("/styles/:styleId/swimmers/:swimmerId")
    .get(function(req, res){
        const styleId = req.params.styleId;
        Style.findById(styleId).select("swimmers").exec(function(err, foundStyle){
            const swimmerId = req.params.swimmerId;
            res.status(200).json(foundStyle.swimmers.id(swimmerId));
        });
    })
    .delete(function(req, res){
        const styleId = req.params.styleId;
        Style.findById(styleId).exec(function(err, foundStyle){
            _deleteSwimmer(req, res, foundStyle);
        });
    });

module.exports = router;