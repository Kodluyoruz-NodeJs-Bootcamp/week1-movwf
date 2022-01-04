const select = (id) => document.getElementById(id);

/*
  TEMPLATES
*/

const studentTemplate = ({ id, imageUrl, name }) => {
  const el = document.createElement("div");
  el.setAttribute("id", id);
  el.setAttribute("draggable", true);
  el.setAttribute("ondragstart", "drag(event)");
  el.setAttribute("aria-label", name);
  el.classList.add("bootcamp__student_container");

  // Images
  el.style.backgroundImage = `url("${imageUrl}")`;
  el.style.backgroundSize = "80px 80px";
  el.style.backgroundRepeat = "no-repeat";

  return el;
};

const learnBoxContent = () => `
  <span class="bootcamp__learn_label">DROP</span>
  <span class="bootcamp__learn_label">TO</span>
  <span class="bootcamp__learn_label">LEARN</span>
  <img
    id="bootcamp__learn-box_logo"
    src="assets/img/logo/node.svg"
    alt="Node.js"
    class="bootcamp__learn_logo"
  />
`;

const progressBar = (studentElId) => {
  const progressEl = document.createElement("div");
  const progressValueEl = document.createElement("div");
  progressEl.setAttribute("id", "progress-" + studentElId);
  progressEl.classList.add("progress");
  progressValueEl.classList.add("progress-value");

  progressEl.appendChild(progressValueEl);

  return progressEl;
};

/*
  VISUAL FUNCTIONALITIES
*/

const studentStates = {
  learning: "yellow",
  success: "green",
};

const setStudentStatus = (studentEl, state) => {
  studentEl.style.borderColor = studentStates[state];
};

const dropOnLearnBox = (studentEl, dropEl) => {
  // Remove all items
  if (!!select("bootcamp__learn-box_logo")) dropEl.innerHTML = "";
  // Refactor learn box container to grid
  dropEl.style.display = "grid";
  dropEl.style.gridTemplateColumns = "1fr 1fr";
  dropEl.style.gridTemplateRows = "1fr 1fr";
  dropEl.style.justifyItems = "center";

  // Student state -> in learning
  setStudentStatus(studentEl, "learning");

  // Append progress bar
  studentEl.appendChild(progressBar(studentEl.id));

  /*
    LEARNING PROCESS SUCCESSFUL
  */
  setTimeout(() => {
    // Append that student to future team box
    studentEl.removeChild(select("progress-" + studentEl.id));
    select("team-container").appendChild(studentEl);

    // Student state -> Success
    setStudentStatus(studentEl, "success");

    // If Learning box is empty reset learn-box
    if (select("learn-box").childElementCount === 0) {
      select("learn-box").innerHTML = learnBoxContent();
      select("learn-box").style.display = "flex";
    }
  }, 3000);
};

/*
  DRAG - DROP FUNCTIONS
*/

const droppable = (event) => event.preventDefault();
const drag = (event) => event.dataTransfer.setData("text", event.target.id);
const drop = (event) => {
  const dropEl = event.target;
  event.preventDefault();

  //
  const studentId = event.dataTransfer.getData("text");
  const el = select(studentId);

  // Prevent stack on student
  if (dropEl.id === "learn-box" && studentId.match("student-")) {
    // Visual Improvenets & Logic
    dropOnLearnBox(el, dropEl);

    dropEl.appendChild(el);
  }
};

/*
  INITIAL RUN
*/

(() => {
  // Render all students
  students.forEach((student, index) =>
    select("bootcamp-student-pane").appendChild(
      studentTemplate({
        id: "student-" + index,
        imageUrl: student.url,
        name: student.name,
      })
    )
  );
})();
