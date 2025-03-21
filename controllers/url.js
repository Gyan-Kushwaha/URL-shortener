const shortid=require("shortid");
const URL=require('../model/url');


async function generateNewShortUrl(req,res) {
    const shortID=shortid();
    const body=req.body;
    if(!body.url) return res.status(404).json({error:'url is required'});
    await URL.create({
        shortId:shortID,
        redirestUrl:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    });
     return res.render('home',{
        id:shortID,
     });
}

async function handleGetAnalytics(req,res) {
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports={
    generateNewShortUrl,
    handleGetAnalytics,
};