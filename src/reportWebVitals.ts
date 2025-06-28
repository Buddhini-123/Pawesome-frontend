import { onCLS, onFCP, onLCP, onTTFB, CLSMetric, FCPMetric, LCPMetric, TTFBMetric } from 'web-vitals';

type ReportHandler = (metric: CLSMetric | FCPMetric | LCPMetric | TTFBMetric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;