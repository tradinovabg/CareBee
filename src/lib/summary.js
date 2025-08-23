export const makeSummary = (profile, visits, meds, i18n) => {
  const t = i18n.t.bind(i18n)
  const now = new Date()
  const dateStr = now.toLocaleDateString(i18n.language)
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
  const today = now.toISOString().slice(0,10)
  const lines = [`${dateStr} ${name}`]

  const todaysVisits = (visits||[]).filter(v=>v.date===today)
  lines.push('', t('summary.visits','Visits today'))
  if(todaysVisits.length){
    todaysVisits.forEach(v=>{
      const parts = [v.time, v.doctor, v.place, v.notes].filter(Boolean)
      lines.push(parts.join(', '))
    })
  }else{
    lines.push(t('summary.noVisits','No visits'))
  }

  const medsLines=[]
  for(const m of meds||[]){
    if(m.mode==='once' && m.once?.date===today){
      const meal = m.meal ? t(`meds.meal_${m.meal}`, m.meal) : ''
      const modeText = t('meds.once','Once')
      medsLines.push([m.name, m.once.time, modeText, meal].filter(Boolean).join(' '))
    }else if(m.mode==='daily'){
      const d=m.daily||{}
      const within=(!d.start || today>=d.start) && (!d.end || today<=d.end)
      if(within){
        const modeText = t('meds.daily','Daily')
        ;(d.times||[]).forEach(time=>{
          const meal = m.meal ? t(`meds.meal_${m.meal}`, m.meal) : ''
          medsLines.push([m.name, time, modeText, meal].filter(Boolean).join(' '))
        })
      }
    }
  }
  lines.push('', t('summary.meds','Meds today'))
  if(medsLines.length) lines.push(...medsLines)
  else lines.push(t('summary.noMeds','No medicines'))

  return lines.join('\n')
}
