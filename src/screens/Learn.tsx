import { useEffect, useState } from 'preact/hooks';
import { useApp } from '../app-context';
import { db, type LessonProgress } from '../data/db';
import type { Lesson } from '../data/types';
import { LEVELS } from '../progress/levels';
import { TaskView } from '../exercises/TaskView';
import { newCard } from '../srs/scheduler';
import { addLessonDrills, passedLevels, type Task } from '../srs/session';
import { awardXp } from '../motivation/record';
import { XP } from '../motivation/streaks';

function Body({ text }: { text: string }) {
  // paragraphs + **bold** + *italic*, nothing else (content is our own)
  return (
    <div class="lesson-body">
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>
          {p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) =>
            part.startsWith('**') ? <b key={j}>{part.slice(2, -2)}</b> : part.startsWith('*') && part.length > 2 ? <i key={j}>{part.slice(1, -1)}</i> : part.split('\n').map((line, k, arr) => <>{line}{k < arr.length - 1 && <br />}</>),
          )}
        </p>
      ))}
    </div>
  );
}

export function Learn() {
  const { data, go, lang } = useApp();
  const [progress, setProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [passed, setPassed] = useState<number[]>([]);
  useEffect(() => {
    if (!lang) return;
    db.lessonProgress.where('lang').equals(lang).toArray().then((l) => setProgress(new Map(l.map((x) => [x.id, x]))));
    passedLevels(lang).then(setPassed);
  }, [lang]);
  if (!data) return null;
  const byLevel = new Map<number, Lesson[]>();
  for (const l of data.lessons) byLevel.set(l.level, [...(byLevel.get(l.level) ?? []), l]);
  return (
    <main>
      <h1>Lessons</h1>
      <p class="muted">Start with Level 0 (script and sounds). You can learn your first 50 words alongside it.</p>
      {[...byLevel.entries()].map(([level, lessons]) => {
        const allDone = lessons.every((l) => progress.has(l.id));
        return (
          <section key={level}>
            <h2>Level {level}: {LEVELS[level].name} <small class="muted">{LEVELS[level].cefr}</small></h2>
            {lessons.map((l) => (
              <button key={l.id} class="card block row" style="text-align:left" onClick={() => go({ name: 'lesson', id: l.id })}>
                <span class="grow"><b>{l.title}</b><br /><small class="muted">{l.kind} · {l.exercises.length} exercises</small></span>
                {progress.has(l.id) ? <span class="pill accent">✓ {Math.round(progress.get(l.id)!.score * 100)}%</span> : <span class="pill">start</span>}
              </button>
            ))}
            <button class={`block ${allDone && !passed.includes(level) ? 'primary' : ''}`} onClick={() => go({ name: 'exam', level })}>
              {passed.includes(level) ? `✓ Level ${level} exam passed (retake)` : `Take the Level ${level} exam`}
            </button>
          </section>
        );
      })}
    </main>
  );
}

export function LessonView({ id }: { id: string }) {
  const { data, go, lang, settings } = useApp();
  const lesson = data?.lessons.find((l) => l.id === id);
  const [stage, setStage] = useState<'read' | 'practice' | 'done'>('read');
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  if (!lesson || !lang) return <main><p>Lesson not found.</p></main>;
  const ex = lesson.exercises[i];

  const finishLesson = async (score: number) => {
    await db.lessonProgress.put({ id: lesson.id, lang, completedAt: Date.now(), score });
    await addLessonDrills(lang, lesson.exercises);
    await awardXp(lang, XP.lessonComplete);
    setStage('done');
  };

  if (stage === 'read') {
    return (
      <main>
        <button class="ghost" onClick={() => go({ name: 'learn' })}>← Lessons</button>
        <h1>{lesson.title}</h1>
        <div class="card"><Body text={lesson.body} /></div>
        {lesson.sources?.length ? <small class="muted">Sources: {lesson.sources.join('; ')}</small> : null}
        {!lesson.verified && <p><small class="pill warn">Written by the app author, not yet checked by a native speaker. Tap ✎ on any exercise to correct it.</small></p>}
        <button class="primary block" style="margin-top:12px" onClick={() => setStage('practice')}>Practice ({lesson.exercises.length})</button>
      </main>
    );
  }
  if (stage === 'done') {
    return (
      <main>
        <h1>Lesson complete</h1>
        <div class="card row"><div class="stat"><b>{correct}/{lesson.exercises.length}</b><small>first-try correct</small></div><div class="stat"><b>+{XP.lessonComplete}</b><small>XP</small></div></div>
        <p class="muted">These exercises are now in your reviews. You'll see them again at spaced intervals.</p>
        <button class="primary block" onClick={() => go({ name: 'learn' })}>Back to lessons</button>
      </main>
    );
  }
  const task: Task = { key: ex.id + i, card: newCard(lang, 'exercise', ex.id, 'drill'), mode: 'exercise', exercise: ex, isNewItem: false };
  return (
    <main>
      <div class="row" style="margin-bottom:12px">
        <button class="ghost" onClick={() => setStage('read')}>← Notes</button>
        <div class="bar grow"><span style={`width:${Math.round((i / lesson.exercises.length) * 100)}%`} /></div>
      </div>
      <TaskView
        task={task}
        onDone={(r) => {
          const c = correct + (r.correct && !r.skipped ? 1 : 0);
          setCorrect(c);
          if (i + 1 >= lesson.exercises.length) finishLesson(c / lesson.exercises.length);
          else setI(i + 1);
        }}
      />
      {settings && null}
    </main>
  );
}
