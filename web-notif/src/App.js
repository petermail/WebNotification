import { useEffect, useState } from 'react';
import './App.css';  
import axios from 'axios';
import sound1 from './sounds/bite.mp3';
import useSound from 'use-sound';

function App() {
  const [play] = useSound(sound1);
  const fileUrl = 'http://rkqjsbymdxcthdbiipoe.supabase.co/storage/v1/object/public/parcl/notify.json';
  const baseLink = 'https://app.parcl.co/parcls/';
  const links = [
    { locality: 'Miami Beach', id: '5353022' },
    { locality: 'New York', id: '5372594' },
    { locality: 'Las Vegas', id: '5377230' },
    { locality: 'San Francisco', id: '5374321' },
    { locality: 'Brooklyn', id: '5822447' },
    { locality: 'Austin', id: '5380879' },
    { locality: 'Los Angeles', id: '5373892' },
    { locality: 'Denver', id: '5306725' },
    { locality: 'Chicago', id: '5387853' },
    { locality: 'Atlanta', id: '5384169' },
    { locality: 'Boston', id: '5407714' },
    { locality: 'Washington', id: '5503877' },
    { locality: 'United States of America', id: '5826765' },
  ];
  const [data, setData] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timerSec, setTimerSec] = useState(30);

  useEffect(() => {
    let interval = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        downloadData();
      }, timerSec * 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timerSec]);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  async function downloadData() {
    try {
      axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'application/json',
      }).then((response) => {
        setData(JSON.parse(response.data));
      });
    } catch (error) {
      console.log('Error downloading data: ', error)
    }
  }

  const Item = ({ data }) => {
    const date = new Date(data.UpdatedAt);
    const min = date?.getMinutes();
    const link = baseLink + links.find(x => x.locality === data.Locality).id;
    return (<div className={"item " + (data.IsLong ? 'long' : 'short')}><a href={link}>
        <div className="innerItem">
          <div>{data.Locality}</div>
          <div>${Math.round(data.Value * 10)/10}</div>
          <div>|</div>
          <div>${Math.round(data.ExpectedGain * 10)/10}</div>
          <div>${Math.round(data.Funding * 10)/10}</div>
          <div>${Math.round(data.Velocity * 10)/10}</div>
          <div>|</div>
          <div>${Math.round(data.HistorySlope * 10)/10}</div>
          <div>|</div>
          { date &&
            <div>{date.getHours()}:{min < 10 ? '0' + min : min}</div>
          }
        </div>
      </a></div>)
  }

  return (
    <div className="App">
      <div className="item">
        value per $1000 | price, funding, velocity | history slope
      </div>
      { data &&
        data.map(x => <Item key={x.Locality} data={x} />)
      }
    </div>
  );
}

export default App;
