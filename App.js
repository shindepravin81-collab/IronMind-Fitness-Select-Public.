import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, Pressable, TextInput,
  StyleSheet, StatusBar, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RED = '#F04438';
const QUOTES = [
  'You do not have to be extreme. You have to be consistent.',
  'Every rep is a vote for the person you want to become.',
  'Discipline carries you when motivation gets quiet.',
  'Progress takes patience. Keep showing up.',
  'Train with purpose. Recover with respect.',
  'Your competition is who you were yesterday.',
  'Small steps. Strong habits. Lasting results.'
];
const WORKOUTS = [
  { name: 'Push-ups', detail: 'Chest · shoulders · triceps', target: '3 sets' },
  { name: 'Squats', detail: 'Quads · glutes · core', target: '3 sets' },
  { name: 'Dumbbell rows', detail: 'Back · biceps', target: '3 sets' },
  { name: 'Plank', detail: 'Core stability', target: '3 rounds' },
  { name: 'Cool-down stretch', detail: 'Mobility · recovery', target: '5 minutes' },
];
const todayKey = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [tab, setTab] = useState('Home');
  const [done, setDone] = useState({});
  const [water, setWater] = useState(0);
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);
  const [goal, setGoal] = useState('Build strength');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('ironmind.v1');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.date === todayKey()) {
            setDone(saved.done || {});
            setWater(saved.water || 0);
          }
          setWeights(saved.weights || []);
          setGoal(saved.goal || 'Build strength');
        }
      } catch (e) {
        // The app remains usable if local storage is unavailable.
      } finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('ironmind.v1', JSON.stringify({
      date: todayKey(), done, water, weights, goal
    })).catch(() => {});
  }, [done, water, weights, goal, loaded]);

  const completed = WORKOUTS.filter((w) => done[w.name]).length;
  const quote = QUOTES[(new Date().getDate() + new Date().getMonth()) % QUOTES.length];

  const addWeight = () => {
    const n = Number(weight);
    if (!Number.isFinite(n) || n < 20 || n > 400) return;
    setWeights((prev) => [{ id: Date.now().toString(), value: n, date: new Date().toLocaleDateString() }, ...prev].slice(0, 30));
    setWeight('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101113" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>IRON<Text style={{color: RED}}>MIND</Text></Text>
          <Text style={styles.tagline}>SHOW UP. GET STRONGER.</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>IM</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'Home' && <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>YOUR DAILY REMINDER</Text>
            <Text style={styles.heroTitle}>BUILD THE{'\n'}STRONGER YOU.</Text>
            <Text style={styles.heroCopy}>{quote}</Text>
            <View style={styles.heroLine} />
            <Text style={styles.heroSmall}>ONE DAY. ONE SESSION. ONE REP AT A TIME.</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completed}/{WORKOUTS.length}</Text>
              <Text style={styles.statLabel}>WORKOUT TASKS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{water}/8</Text>
              <Text style={styles.statLabel}>GLASSES OF WATER</Text>
            </View>
          </View>

          <SectionTitle title="TODAY'S MISSION" subtitle="Small actions make strong habits." />
          <View style={styles.card}>
            {WORKOUTS.map((w, i) => (
              <Pressable key={w.name} style={styles.workoutRow} onPress={() => setDone(p => ({...p, [w.name]: !p[w.name]}))}>
                <View style={[styles.check, done[w.name] && styles.checkDone]}>
                  {done[w.name] ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <View style={{flex: 1}}>
                  <Text style={[styles.workoutName, done[w.name] && styles.strike]}>{w.name}</Text>
                  <Text style={styles.workoutDetail}>{w.detail}</Text>
                </View>
                <Text style={styles.target}>{w.target}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setTab('Workout')}>
            <Text style={styles.primaryButtonText}>OPEN WORKOUT PLAN  →</Text>
          </Pressable>
        </>}

        {tab === 'Workout' && <>
          <SectionTitle title="WORKOUT PLAN" subtitle="A simple starter routine. Adapt it to your ability." />
          <View style={styles.notice}><Text style={styles.noticeText}>Warm up first, use controlled form, and rest between sets. Stop if you feel sharp pain, dizziness, or unwell.</Text></View>
          {WORKOUTS.map((w, i) => <View key={w.name} style={styles.planCard}>
            <View style={styles.planNumber}><Text style={styles.planNumberText}>{String(i+1).padStart(2,'0')}</Text></View>
            <View style={{flex:1}}>
              <Text style={styles.workoutName}>{w.name}</Text>
              <Text style={styles.workoutDetail}>{w.detail}</Text>
              <Text style={styles.target}>{w.target}</Text>
            </View>
            <Pressable style={[styles.smallButton, done[w.name] && styles.smallButtonDone]} onPress={() => setDone(p => ({...p, [w.name]: !p[w.name]}))}>
              <Text style={styles.smallButtonText}>{done[w.name] ? 'DONE ✓' : 'MARK DONE'}</Text>
            </Pressable>
          </View>)}
        </>}

        {tab === 'Progress' && <>
          <SectionTitle title="YOUR PROGRESS" subtitle="Track trends, not just one day's number." />
          <View style={styles.card}>
            <Text style={styles.inputLabel}>BODY WEIGHT (KG)</Text>
            <View style={styles.inputRow}>
              <TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="e.g. 72.5" placeholderTextColor="#777" style={styles.input} />
              <Pressable style={styles.addButton} onPress={addWeight}><Text style={styles.addButtonText}>ADD</Text></Pressable>
            </View>
            <Text style={styles.muted}>Log at a similar time of day for a more useful comparison.</Text>
          </View>
          <SectionTitle title="RECENT ENTRIES" subtitle="Saved on this device." />
          {weights.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Your journey starts here.</Text><Text style={styles.muted}>Add your first weight entry above.</Text></View> :
            weights.map(item => <View key={item.id} style={styles.entryRow}><View><Text style={styles.entryWeight}>{item.value} kg</Text><Text style={styles.muted}>{item.date}</Text></View><Text style={styles.entryDot}>●</Text></View>)}
        </>}

        {tab === 'Habits' && <>
          <SectionTitle title="DAILY HABITS" subtitle="Consistency beats perfection." />
          <View style={styles.card}>
            <Text style={styles.workoutName}>Hydration tracker</Text>
            <Text style={styles.muted}>Track glasses of water. Adjust your needs for activity, climate, and medical advice.</Text>
            <View style={styles.waterRow}>
              <Pressable style={styles.waterButton} onPress={() => setWater(v => Math.max(0, v-1))}><Text style={styles.waterButtonText}>−</Text></Pressable>
              <View style={{alignItems:'center', flex:1}}><Text style={styles.waterNumber}>{water} / 8</Text><Text style={styles.muted}>glasses logged</Text></View>
              <Pressable style={styles.waterButton} onPress={() => setWater(v => Math.min(8, v+1))}><Text style={styles.waterButtonText}>+</Text></Pressable>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, {width: `${water/8*100}%`}]} /></View>
          </View>
          <View style={styles.card}>
            <Text style={styles.workoutName}>What are you working toward?</Text>
            {['Build strength', 'Build muscle', 'Improve fitness', 'Stay consistent'].map(g => <Pressable key={g} onPress={() => setGoal(g)} style={styles.goalRow}><View style={[styles.radio, goal===g && styles.radioActive]} /> <Text style={styles.goalText}>{g}</Text></Pressable>)}
          </View>
          <View style={styles.notice}><Text style={styles.noticeText}>Recovery matters: aim for adequate sleep, balanced meals, and gradual progression. This app provides general fitness guidance, not medical advice.</Text></View>
        </>}
      </ScrollView>

      <View style={styles.nav}>
        {[['Home','⌂'],['Workout','▤'],['Progress','↗'],['Habits','◎']].map(([name, icon]) => (
          <Pressable key={name} style={styles.navItem} onPress={() => setTab(name)}>
            <Text style={[styles.navIcon, tab===name && styles.navSelected]}>{icon}</Text>
            <Text style={[styles.navLabel, tab===name && styles.navSelected]}>{name}</Text>
            {tab===name && <View style={styles.navIndicator} />}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function SectionTitle({title, subtitle}) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#101113',paddingTop:Platform.OS==='android'?4:0},
  header:{height:74,paddingHorizontal:22,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#25262A'},
  brand:{fontSize:25,fontWeight:'900',letterSpacing:1.5,color:'#FFFFFF'},
  tagline:{fontSize:9,letterSpacing:2.2,color:'#96979D',marginTop:2},
  avatar:{width:39,height:39,borderRadius:13,backgroundColor:'#292A2F',borderWidth:1,borderColor:'#44454A',alignItems:'center',justifyContent:'center'},
  avatarText:{color:RED,fontWeight:'900'},
  content:{padding:20,paddingBottom:32},
  hero:{backgroundColor:'#202125',borderRadius:22,padding:23,overflow:'hidden',borderWidth:1,borderColor:'#34353A'},
  eyebrow:{color:RED,fontSize:10,fontWeight:'900',letterSpacing:2},
  heroTitle:{fontSize:36,lineHeight:39,fontWeight:'900',color:'#FFFFFF',marginTop:15,letterSpacing:-1},
  heroCopy:{fontSize:14,lineHeight:21,color:'#C5C5CB',marginTop:15,maxWidth:290},
  heroLine:{height:3,width:48,backgroundColor:RED,marginTop:20,marginBottom:13,borderRadius:4},
  heroSmall:{fontSize:9,fontWeight:'800',letterSpacing:1.3,color:'#A3A4AA'},
  statsRow:{flexDirection:'row',gap:12,marginTop:14},
  statCard:{flex:1,backgroundColor:'#1B1C20',borderRadius:16,padding:17,borderWidth:1,borderColor:'#2E2F34'},
  statNumber:{fontSize:25,fontWeight:'900',color:'#FFFFFF'},
  statLabel:{fontSize:9,fontWeight:'800',letterSpacing:1,color:'#9A9BA2',marginTop:5},
  sectionTitle:{marginTop:25,marginBottom:13},
  sectionHeading:{fontSize:19,fontWeight:'900',color:'#FFFFFF',letterSpacing:.3},
  sectionSubtitle:{fontSize:12,color:'#909198',marginTop:5,lineHeight:17},
  card:{backgroundColor:'#1B1C20',borderRadius:17,paddingHorizontal:16,paddingVertical:6,borderWidth:1,borderColor:'#2E2F34'},
  workoutRow:{flexDirection:'row',alignItems:'center',paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#303136',gap:12},
  check:{width:24,height:24,borderRadius:8,borderWidth:1.5,borderColor:'#66676D',alignItems:'center',justifyContent:'center'},
  checkDone:{backgroundColor:RED,borderColor:RED},
  checkMark:{color:'#FFF',fontWeight:'900'},
  workoutName:{fontSize:14,fontWeight:'800',color:'#F6F6F7'},
  workoutDetail:{fontSize:11,color:'#96979D',marginTop:4},
  target:{fontSize:10,color:RED,fontWeight:'800',marginTop:5},
  strike:{textDecorationLine:'line-through',color:'#909198'},
  primaryButton:{marginTop:15,backgroundColor:RED,borderRadius:13,padding:17,alignItems:'center'},
  primaryButtonText:{color:'#FFF',fontWeight:'900',fontSize:12,letterSpacing:1},
  notice:{padding:15,backgroundColor:'#2B241E',borderRadius:14,borderWidth:1,borderColor:'#514031',marginBottom:15},
  noticeText:{color:'#E8CBA9',fontSize:12,lineHeight:18},
  planCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#1B1C20',borderRadius:16,padding:15,marginBottom:10,borderWidth:1,borderColor:'#2E2F34'},
  planNumber:{width:39,height:43,borderRadius:10,backgroundColor:'#302124',alignItems:'center',justifyContent:'center'},
  planNumberText:{fontSize:14,color:RED,fontWeight:'900'},
  smallButton:{paddingHorizontal:10,paddingVertical:9,borderRadius:9,borderWidth:1,borderColor:'#56575D'},
  smallButtonDone:{backgroundColor:'#26372C',borderColor:'#3B6A47'},
  smallButtonText:{fontSize:9,color:'#F1F1F3',fontWeight:'900'},
  inputLabel:{fontSize:10,color:'#A7A8AE',fontWeight:'900',letterSpacing:1.2,marginTop:13},
  inputRow:{flexDirection:'row',gap:10,marginTop:10},
  input:{flex:1,backgroundColor:'#111215',borderRadius:11,borderWidth:1,borderColor:'#393A40',paddingHorizontal:14,paddingVertical:12,color:'#FFF',fontSize:16},
  addButton:{backgroundColor:RED,borderRadius:11,paddingHorizontal:22,alignItems:'center',justifyContent:'center'},
  addButtonText:{fontWeight:'900',color:'#FFF'},
  muted:{fontSize:11,lineHeight:17,color:'#96979D',marginTop:9},
  empty:{padding:22,alignItems:'center',backgroundColor:'#1B1C20',borderRadius:15},
  emptyTitle:{fontSize:15,fontWeight:'800',color:'#FFF'},
  entryRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:17,backgroundColor:'#1B1C20',borderRadius:13,marginBottom:8,borderWidth:1,borderColor:'#2E2F34'},
  entryWeight:{fontSize:18,fontWeight:'900',color:'#FFF'},
  entryDot:{color:RED,fontSize:14},
  waterRow:{flexDirection:'row',alignItems:'center',marginTop:20,marginBottom:15},
  waterButton:{width:45,height:45,borderRadius:14,backgroundColor:'#292A2F',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#484950'},
  waterButtonText:{fontSize:27,color:'#FFF',fontWeight:'500'},
  waterNumber:{fontSize:22,color:'#FFF',fontWeight:'900'},
  progressTrack:{height:7,borderRadius:8,backgroundColor:'#35363B',overflow:'hidden',marginBottom:12},
  progressFill:{height:7,backgroundColor:RED,borderRadius:8},
  goalRow:{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#303136',gap:12},
  radio:{width:19,height:19,borderRadius:10,borderWidth:1.5,borderColor:'#66676D'},
  radioActive:{backgroundColor:RED,borderColor:RED},
  goalText:{fontSize:13,color:'#E9E9EB',fontWeight:'600'},
  nav:{flexDirection:'row',height:72,backgroundColor:'#17181B',borderTopWidth:1,borderTopColor:'#303136',paddingBottom:Platform.OS==='ios'?8:2},
  navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:3,position:'relative'},
  navIcon:{fontSize:22,color:'#777880'},
  navLabel:{fontSize:10,color:'#777880',fontWeight:'700'},
  navSelected:{color:RED},
  navIndicator:{position:'absolute',top:0,width:24,height:3,backgroundColor:RED,borderBottomLeftRadius:3,borderBottomRightRadius:3}
});