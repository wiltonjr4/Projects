import { config } from '../config/Constants'
import { Request, Response } from 'express'
import shortId from 'shortid'
import { URLModel } from '../database/model/URL'

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {
        const { originURL } = req.body

        // Check if the URL already exists in DB
        const url = await URLModel.findOne({ originURL })
        if(url) {
            res.json(url)
            return
        }

        // Create the Hash to the URL
        const hash = shortId.generate()
        const shortURL = `${ config.API_URL }/${ hash }`
        
        // Return new URL shortened
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        res.json(newURL)
    }

    public async redirect(req: Request, res: Response): Promise<void> {

        const { hash } = req.params
        const url = await URLModel.findOne({ hash })

        if(url) {
            res.redirect(url.originURL)
            return
        }

        res.status(400).json({ error: 'URL not found '})
    }
}