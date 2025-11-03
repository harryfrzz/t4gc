# Player of the Match Voting System

A comprehensive fan engagement feature that allows visitors to vote for standout players after each match, with live results, automatic badge awards, and leaderboard tracking.

## 🎯 Features

### Core Functionality
- **Fan Voting**: Visitors can vote for one player per match
- **Live Results**: Real-time vote counting with progress bars and percentages
- **Player of the Match Awards**: Automatic badge assignment to winners
- **Badge System**: Cumulative awards displayed on player profiles
- **Vote Security**: IP/session-based voting limits to prevent duplicates
- **Rate Limiting**: API protection against spam (10 votes per minute per IP)

### User Experience
- **Clean UI**: Card-based design with player avatars and team information
- **Animations**: Smooth transitions, confetti effects, and progress bars
- **Toast Notifications**: Clear feedback for all user actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation and ARIA labels

### Admin Features
- **Close Voting**: Manual voting closure with winner determination
- **Results Freezing**: Permanent results display after match completion
- **Override Capability**: Admin can reset votes if needed (future enhancement)

## 📁 File Structure

```
lib/voting/
├── types.ts           # TypeScript interfaces and types
└── utils.ts           # Voting logic, badge management, mock data

app/api/voting/
├── vote/route.ts      # POST/GET endpoints for voting
└── close/route.ts     # POST endpoint to close voting

components/voting/
├── PlayerVotingCard.tsx       # Individual player card with vote button
├── VotingResults.tsx          # Live results with progress bars
└── PlayerOfTheMatchBadge.tsx  # Trophy badge component

app/voting/
└── page.tsx          # Main voting page with tabs

components/participants/
└── ParticipantHoverCard.tsx   # Updated to show POTM badges
```

## 🚀 Usage

### Access the Voting Page
Navigate to `/voting` in your browser or click "Fan Voting" in the sidebar.

### Cast a Vote
1. Go to the "Vote" tab
2. Browse available players from the match
3. Click the "Vote" button on your chosen player
4. Receive confirmation toast
5. View live results in the "Results" tab

### View Results
- **During Voting**: See live vote counts and percentages
- **After Closing**: Winner highlighted with gold trophy badge
- **Player Profiles**: Badge count displayed in hover cards

### Close Voting (Admin)
1. Click "Close Voting" button on the voting page
2. System determines winner (highest votes)
3. Awards "Player of the Match" badge automatically
4. Results frozen and displayed publicly

## 🔧 API Endpoints

### POST `/api/voting/vote`
Submit a vote for a player.

**Request Body:**
```json
{
  "matchId": "match-1",
  "playerId": "1",
  "playerName": "Alice Smith",
  "team": "Blue Strikers",
  "role": "Player"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for voting!",
  "voteCounts": [...]
}
```

**Error Responses:**
- `409`: Already voted
- `429`: Rate limit exceeded
- `400`: Voting closed or invalid data

### GET `/api/voting/vote?matchId=match-1&voterCheck=true`
Fetch voting data for a match.

**Response:**
```json
{
  "success": true,
  "data": {
    "matchId": "match-1",
    "status": "active",
    "voteCounts": [...],
    "totalVotes": 55,
    "winner": null,
    "hasUserVoted": false
  }
}
```

### POST `/api/voting/close`
Close voting and determine winner (admin only).

**Request Body:**
```json
{
  "matchId": "match-1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Voting closed. Alice Smith wins Player of the Match!",
  "winner": {...},
  "votingData": {...}
}
```

## 🛡️ Security Features

### Vote Validation
- One vote per match per user (IP/session based)
- Voting status checks (active/closed/completed)
- Input validation and sanitization

### Rate Limiting
- 10 votes per minute per IP address
- Prevents spam and abuse
- Configurable limits

### Future Enhancements
- OAuth/email-based authentication
- CAPTCHA for additional security
- Admin dashboard for vote management
- Audit logs for all voting actions

## 📊 Data Storage

### Current Implementation (Mock Data)
Uses in-memory storage with Map objects:
- `votingData`: Match voting information
- `playerStats`: Player badge counts and history

### Production Recommendation
Replace with database storage:

**Tables:**
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  match_id VARCHAR,
  player_id VARCHAR,
  voter_identifier VARCHAR,
  timestamp TIMESTAMP,
  UNIQUE(match_id, voter_identifier)
);

CREATE TABLE player_stats (
  player_id VARCHAR PRIMARY KEY,
  player_name VARCHAR,
  potm_count INT DEFAULT 0,
  total_votes_received INT DEFAULT 0,
  updated_at TIMESTAMP
);

CREATE TABLE player_badges (
  id UUID PRIMARY KEY,
  player_id VARCHAR,
  match_id VARCHAR,
  awarded_at TIMESTAMP,
  vote_count INT,
  vote_percentage DECIMAL
);
```

## 🎨 UI Components

### PlayerVotingCard
- Gradient avatar with initials
- Player name, team, and role
- Animated vote button with heart icon
- Confetti effect on vote submission
- Disabled state after voting

### VotingResults
- Ranked list with progress bars
- Live percentage calculations
- Winner highlighting (gold gradient)
- Leading player indicator
- Empty state for no votes

### PlayerOfTheMatchBadge
- Trophy icon with count
- Yellow/gold color scheme
- Multiple sizes (sm, md, lg)
- Tooltip with award details

## 🔄 Future Enhancements

### Season MVP Leaderboard
```typescript
// Track cumulative stats across all matches
interface SeasonStats {
  playerId: string;
  totalVotes: number;
  potmCount: number;
  averageVotePercentage: number;
  rank: number;
}
```

### Voter Engagement System
- Points for regular voting
- Achievements and milestones
- Leaderboard for most active voters

### Social Sharing
- Share vote on Twitter/Facebook
- Winner announcement graphics
- Match results sharing

### Notifications
- Email to winner after badge award
- Push notifications for voting reminders
- Real-time updates during matches

### Analytics
- Vote patterns and trends
- Popular players statistics
- Match engagement metrics
- Regional voting data

## 🧪 Testing

### Initialize Mock Data
```typescript
import { initializeMockVotingData } from '@/lib/voting/utils';

// Call on component mount or app initialization
initializeMockVotingData();
```

### Test Scenarios
1. **Single Vote**: Cast one vote and verify results
2. **Duplicate Vote**: Try voting twice (should be rejected)
3. **Multiple Users**: Simulate different IPs voting
4. **Close Voting**: End voting and verify winner
5. **Badge Display**: Check hover card shows badges
6. **Rate Limiting**: Send rapid requests to test limits

## 📱 Responsive Design

### Desktop (lg+)
- 3-column player grid
- Side-by-side tabs
- Full results with all details

### Tablet (md)
- 2-column player grid
- Stacked layout
- Compact results view

### Mobile (sm)
- Single column stack
- Full-width cards
- Touch-optimized buttons

## ⚡ Performance

### Optimizations
- Lazy loading of voting data
- Debounced API calls
- Optimistic UI updates
- Memoized calculations
- Efficient re-renders

### Monitoring
- Track vote submission time
- Monitor API response times
- Alert on rate limit breaches
- Log voting anomalies

## 🤝 Contributing

When adding new features:
1. Update types in `lib/voting/types.ts`
2. Add utility functions in `lib/voting/utils.ts`
3. Create/update API endpoints
4. Build UI components
5. Update this README
6. Add tests

## 📄 License

Part of the Y-Ultimate Management Platform.
