/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import SimpleButton from "./SimpleButton";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

test("ボタンをクリックするとON/OFFの表示が切り替わる", async () => {
  // SimpleButtonのレンダリング
  render(<SimpleButton />);
  // ボタン要素を取得
  const simpleButton = screen.getByRole("button");
  // テキストがOFFになっていることを確認
  expect(simpleButton).toHaveTextContent("OFF");
  // クリックイベントでボタンをクリック
  userEvent.click(simpleButton);

  await waitFor(() => {
    // テキストがONになっていることを確認
    expect(simpleButton).toHaveTextContent("ON");
  });
});

test("描画されてすぐはOFFと表示されている", () => {
  const view = render(<SimpleButton />);
  expect(view.container).toMatchSnapshot();
});
