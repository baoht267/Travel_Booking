import { Card, Container, Stack } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import StayCard from '../components/stay/StayCard'
import mockExperiences from '../data/mockExperiences'
import { selectAllStays } from '../features/stays/staysSlice'

function SavedPage() {
  const stays = useSelector(selectAllStays)
  const savedIds = useSelector((state) => state.saved.savedIds)
  const savedStays = [...stays, ...mockExperiences].filter((stay) =>
    savedIds.includes(stay.id),
  )

  return (
    <Container className="page-section">
      <Stack gap={3}>
        <div>
          <span className="section-kicker">Wishlist</span>
          <h1 className="section-title mt-2">Saved stays on this device</h1>
          <p className="section-copy">
            The list persists in localStorage, so refreshes keep the user shortlist intact.
          </p>
        </div>

        {savedStays.length > 0 ? (
          savedStays.map((stay) => <StayCard key={stay.id} stay={stay} />)
        ) : (
          <Card className="surface-card empty-state">
            <Card.Body>
              <h2 className="h4 fw-bold">No saved stays yet</h2>
              <p className="text-secondary">
                Save items from the results page to turn this into a working wishlist.
              </p>
              <Link to="/search" className="btn btn-primary rounded-pill fw-bold px-4">
                Browse stays
              </Link>
            </Card.Body>
          </Card>
        )}
      </Stack>
    </Container>
  )
}

export default SavedPage
