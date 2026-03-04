---
title: "[dnd-kit] Draggableコンポーネントにdata属性をつける"
date: "2025-01-21T15:00:00.000Z"
---

# 背景

Draggableコンポーネントで作ったドラッグで動かす要素に任意のdata属性を持たせたい。  
具体的には…jsonファイルをデータベースとしたカテゴリのあるTodoアプリケーションを作成しており、各Todoを他のカテゴリにドラッグ＆ドロップで移動させる際に、その後の処理に必要な元のカテゴリIDをコンポーネントに持たせたい。  

# **環境**

* react: 18.3.1
* dnd-kit/core: 6.3.1

  
# 実装

`handleDragEnd()`では、`over`でドロップした先の情報が、`active`でドラッグした要素の情報が格納されている。  
`active.data.current`を通じてドラッグした要素のデータにアクセス可能だが、  
Draggableコンポーネントにdata属性をつけるだけでは`active.data.current.data`は未定義となる。  
  
`useDraggable()`にdata属性を渡すように記述を追加する必要がある。  

```
import { DndContext } from '@dnd-kit/core';
import { Draggable } from '@/components/Draggable';
import { Droppable } from '@/components/Droppable';

const todos = [
  {
    "categoryId": 2025101,
    "title": "Do First",
    "todos": [
      {"id": 1737365100054, "todo": "メールの返信"},
      {"id": 1737365107891, "todo": "◯◯へ送金"}
    ]
  },
  {
    "categoryId": 2025102,
    "title": "Schedule",
    "todos": [
      {"id": 1737356538174,"todo": "机周りの整理"}
    ]
  }
];

// ドラッグ＆ドロップが終わった後に発火
function handleDragEnd(event) {
  const { over, active } = event;
  if (!over) return;

  // ドロップ先のカテゴリID
  const targetCategoryId = over.id;
  // ドラッグされたアイテムのID
  const draggedItemId = active.id;  
  // ドラッグされたアイテムのカテゴリID　※←ここの取得が今回の目的
  const draggedItemCategory = active.data.current.categoryId;
};

return (
  <>
    <DndContext onDragEnd={handleDragEnd}>
      {Todos.map((category) => (
        <div key={category.categoryId}>
          <Droppable key={category.categoryId} id={category.categoryId}>
            <h3>{category.title}</h3>
            {category.todos.map((todo) => (
              <div key={todo.id}>
                <Draggable
                  key={todo.id}
                  id={todo.id}
                  data={{categoryId: category.categoryId}} // data属性追加
                >
                  {todo.todo}
                </Draggable>
              </div>
            ))}
          </Droppable>
        </div>
      ))}
    </DndContext>
      </>
      );
```

  
##### Draggable.jsx

```
import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    data: props.data, //data属性の設定を追加
  });
  const style = transform 
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        backgroundColor: '#666',
        color: 'white',
        padding: '8px',
      }
    : {
        backgroundColor: '#f24e3c',
        color: 'white',
        padding: '8px',
      };
  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
```

  
※その他のコンポーネントは割愛  

# 終わりに

そもそもjsonの構造設計的に、カテゴリ＞Todoとするのはアンチパターンではないでしょうか（戒め）  

# 参考サイト

<https://zenn.dev/castingone%5Fdev/articles/dndkit20231031>  
