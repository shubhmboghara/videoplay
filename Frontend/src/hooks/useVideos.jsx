import { useEffect, useState } from 'react'
import axios from 'axios'

export function useVideo(id) {
    const [video, setVideo] = useState(null)
    const [Videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true);
        axios('/mockVideos.json')
            .then((res) => {
                const data = res.data
                const selected = data.find(v => v.id === id)
                setVideo(selected);
                setVideos(data.filter(v => v.id !== id))
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }, [id])

    return { video, Videos, loading, error }
}
