import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { MilliePageReal } from "./MilliePageReal";

// 개발용 컨트롤 패널
const DevPanel = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  max-width: 300px;
`;

const DevTitle = styled.h3`
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const DevButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const DevButton = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.variant) {
      case "danger":
        return `
          background: #e53e3e;
          color: white;
          &:hover {
            background: #c53030;
          }
        `;
      default:
        return `
          background: #667eea;
          color: white;
          &:hover {
            background: #5a67d8;
          }
        `;
    }
  }}
`;

const StatusText = styled.div`
  color: #666;
  font-size: 11px;
  margin-top: 8px;
  padding: 8px;
  background: #f7fafc;
  border-radius: 4px;

  span {
    font-weight: 600;
    color: #333;
  }
`;
const PresetSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

const PresetTitle = styled.h4`
  color: #333;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 600;
`;

const PresetButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid ${(props) => (props.isActive ? "#667eea" : "#cbd5e0")};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.isActive ? "#667eea" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#4a5568")};
  width: 100%;
  margin-bottom: 6px;
  text-align: left;

  &:hover {
    background: ${(props) => (props.isActive ? "#5a67d8" : "#f7fafc")};
    border-color: #667eea;
  }

  .preset-id {
    font-weight: 700;
    margin-right: 6px;
  }

  .preset-name {
    font-size: 10px;
  }
`;

const CurrentPreset = styled.div`
  padding: 6px 8px;
  background: #edf2f7;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #2d3748;

  strong {
    color: #667eea;
  }
`;

// eslint-disable-next-line react-refresh/only-export-components
export default function App() {
  const [widget, setWidget] = useState<MillieChatPlugin | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<string>("차선겸");
  const [currentPresetId, setCurrentPresetId] = useState<number>(60);

  const presetOptions = [
    { id: 61, name: "[채팅 모델] 밀리 캐릭터 - GPT4o" },
    { id: 60, name: "[채팅 모델] 밀리 캐릭터 - 제미나이" },
    { id: 59, name: "[채팅 모델] 밀리 캐릭터 - 클로드" },
  ];

  useEffect(() => {
    // SDK 초기화 예제
    // 1. MillieChatPlugin 인스턴스 생성
    console.log("HI");
    const plugin = new window.MillieChatSDK.MillieChatPlugin({
      // 모바일에서 전체화면 여부
      mobileFullscreen: true,

      onChatRoomCreated: async (a, b) => {
        console.log(a, b, "챗룸생성 함수...");
      },
      onClickSendButton: async (a, b) => {
        console.log(a, b, "보내기이벤트...");
      },
      // 프로필 이미지 클릭 이벤트 핸들러
      onClickProfileImage: async (a, b) => {
        console.log(a, b, "Profile image clicked! Moving to detail page...");
        alert(
          "프로필을 클릭했습니다! 여기에 상세 페이지 이동 로직을 구현하세요."
        );
      },
    });

    // React state에 저장
    setWidget(plugin);

    console.log("✅ Millie Chat SDK 초기화 완료");

    // 컴포넌트 언마운트 시 정리
    return () => {
      plugin.destroy();
      console.log("🧹 Widget 정리 완료");
    };
  }, []);
  const changePreset = (presetId: number) => {
    setCurrentPresetId(presetId);
    if (widget) {
      widget.setPresetId(presetId);
      console.log(`✅ Preset changed to: ${presetId}`);
    }
  };

  const showLocalStorageKey = () => {
    const myKey = localStorage?.getItem("millie-session-key");
    if (!myKey) {
      return alert("키를 먼저 발급받아주세요");
    } else {
      widget?.show({ sessionId: myKey, character: currentCharacter }); // 다른 캐릭터로 테스트
      setIsVisible(true);
      setClickCount((prev) => prev + 1);
    }
  };

  const showWidget = () => {
    // 새 세션 ID 생성 또는 기존 세션 사용
    const oldKey = "c5b144f8-c54f-450c-9545-57745489cf15";
    const sessionId = oldKey;

    // show 메서드에 sessionId와 characterName 전달
    widget?.show({ sessionId, character: currentCharacter });
    setIsVisible(true);
    setClickCount((prev) => prev + 1);
    console.log(
      "Widget shown with session:",
      sessionId,
      "character:",
      currentCharacter
    );
  };

  const showNewChat = () => {
    // 새로운 세션 ID 생성하여 새 채팅방 열기
    const newSessionId = MillieChatSDK.MillieChatPlugin.newSessionId();
    localStorage?.setItem("millie-session-key", newSessionId);
    widget?.show({ sessionId: newSessionId, character: currentCharacter }); // 다른 캐릭터로 테스트
    setIsVisible(true);
    setClickCount((prev) => prev + 1);
    console.log("New chat opened with session:", newSessionId);
  };

  const hideWidget = () => {
    widget?.hide();
    setIsVisible(false);
    setClickCount((prev) => prev + 1);
    console.log("Widget hidden");
  };

  const destroyWidget = () => {
    if (widget) {
      widget.destroy();
      setWidget(null);
      setIsVisible(false);
      console.log("Widget destroyed");

      // 2초 후 재생성
      setTimeout(() => {
        const newPlugin = new MillieChatPlugin({
          position: "bottom-right",
          mobileFullscreen: true,
          characterImages: ["🤴", "👑", "💜", "🌹"],
          onChatRoomCreated: async (a, b) => {
            console.log(a, b, "챗룸생성...");
          },
          onClickSendButton: async (a, b) => {
            console.log(a, b, "보내기이벤트...");
          },

          messageLimit: 100,
          onClickProfileImage: async (a, b) => {
            console.log(
              a,
              b,
              "Profile image clicked! Moving to detail page..."
            );
            alert("프로필을 클릭했습니다!");
          },
        });
        setWidget(newPlugin);
        console.log("✅ Widget 재생성 완료");
      }, 2000);
    }
  };

  const toggleCharacter = () => {
    if (currentCharacter === "차선겸") {
      setCurrentCharacter("차선겸");
    } else {
      setCurrentCharacter("차선겸");
    }
  };

  return (
    <>
      {/* Millie 페이지 렌더링 - 실제 HTML 사용 */}
      <MilliePageReal onStartChat={showWidget} />

      {/* 개발용 컨트롤 패널 */}
      <DevPanel>
        <DevTitle>🛠 SDK 테스트 컨트롤</DevTitle>

        <DevButtonGroup>
          <DevButton onClick={showWidget}>
            하드코딩키로 대화하기(남이랑공유중)
          </DevButton>
          <DevButton onClick={showNewChat}>
            세션키 새로 발급받아 대화하기
          </DevButton>
          <DevButton onClick={showLocalStorageKey}>
            기존 내 키로 대화하기
          </DevButton>
          <DevButton onClick={hideWidget}>Hide</DevButton>
          <DevButton onClick={toggleCharacter}>
            Toggle Character {currentCharacter}
          </DevButton>
          <DevButton variant="danger" onClick={destroyWidget}>
            Destroy
          </DevButton>

          <PresetSection>
            <PresetTitle>🤖 Preset 선택</PresetTitle>
            <CurrentPreset>
              현재 Preset: <strong>ID {currentPresetId}</strong>
            </CurrentPreset>
            {presetOptions.map((preset) => (
              <PresetButton
                key={preset.id}
                isActive={currentPresetId === preset.id}
                onClick={() => changePreset(preset.id)}
              >
                <span className="preset-id">{preset.id}</span>
                <span className="preset-name">{preset.name}</span>
              </PresetButton>
            ))}
          </PresetSection>
        </DevButtonGroup>

        <StatusText>
          초기화: <span>{widget ? "✅" : "❌"}</span> | 표시:{" "}
          <span>{isVisible ? "✅" : "❌"}</span> | 클릭:{" "}
          <span>{clickCount}</span>
        </StatusText>
      </DevPanel>
    </>
  );
}
