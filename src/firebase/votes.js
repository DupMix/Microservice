import admin from './admin'
import { isBefore, isAfter, sub, getDay, nextTuesday, nextSunday, format, parseISO } from 'date-fns'

export const submitVotesToFirebase = (userId, votes, date) => {
  const voteFields = Object.keys(votes)
  voteFields.forEach(field => {
    if (field === 'heardBefore') return votes.heardBefore.forEach(heard => {
      submitVoteToFirebase(userId, heard, 0)
    })
    submitVoteToFirebase(userId, votes[field], valueVote(field), date)
  })
}

const valueVote = (field) => {
  switch (field) {
    case 'first':
      return 3
    case 'second':
      return 2
    case 'third':
      return 1
    default:
      return 0
  }
}

const submitVoteToFirebase = (userId, trackName, score, date) => {
  try {
    const votes = admin.database().ref('vote/')
    const newVote = votes.push()
    newVote.set({
      userId,
      trackName,
      score,
      updated_at: format(parseISO(date) || new Date(), 'yyyy-MM-dd'),
      created_at: format(parseISO(date) || new Date(), 'yyyy-MM-dd'),
    })
  } catch (error) {
    console.error("vote submit error:", error)
  }
}

export const userVotedThisWeek = async (user, date) => {
  try {
    const thisWeeksVotes = await getAllWeekVotes(date)
    if (thisWeeksVotes.some(({ userId }) => userId === user)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('checking this weeks votes error:', error)
  }
}

export const getAllWeekVotes = async (date) => {
  try {
    const snapshot = await admin
      .database()
      .ref()
      .child('vote')
      .get()
    const allVotes = snapshot.exists() && snapshot.val() 
    if (!allVotes) return []
    const parsedDate = parseISO(date)
    const lastSunday = sub(parsedDate, { days: getDay(parsedDate) })
    const votes = Object.values(allVotes)
    return votes.filter(({ created_at }) => {
      const made = parseISO(created_at)
      return (isAfter(made, nextTuesday(lastSunday) && isBefore(made, nextSunday(parsedDate))))
    // is after this tuesday and before next sunday
    })
  } catch (error) {
    console.log('error getting votes:', error)
  }
}

    