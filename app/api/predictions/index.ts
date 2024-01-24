import { NextApiRequest, NextApiResponse } from 'next'

interface PredictionRequest {
  prompt: string
}

interface PredictionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    text: string
    index: number
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: '2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2',
        input: { prompt: (req.body as PredictionRequest).prompt }  
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(500).json({ message: error.detail })  
    }

    const prediction = (await response.json()) as PredictionResponse
    
    return res.status(201).json({
      id: prediction.id,
      text: prediction.choices[0].text
    })

  } catch (error) {
    return res.status(500).json({ message: 'Error making prediction' })  
  }
}
