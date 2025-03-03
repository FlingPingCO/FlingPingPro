import { Helmet } from 'react-helmet';
import IllustrationLibrary from '@/components/IllustrationLibrary';

export default function Illustrations() {
  return (
    <>
      <Helmet>
        <title>Illustration Library | FlingPing.co</title>
        <meta name="description" content="Browse our collection of diverse, inclusive health-related illustrations for use in your FlingPing.co projects." />
      </Helmet>
      
      <IllustrationLibrary />
    </>
  );
}