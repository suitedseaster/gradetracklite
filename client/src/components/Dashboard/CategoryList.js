import React, { useContext } from "react";
import plusIco from "../../img/plus-svgrepo-com.svg";
import { ColoredPercent, floatToDecimalStr } from "../../utils/Util";
import { contextCourse, contextSelectedItem, contextSemester } from "./ContentPane";
import GradeList from "./GradeList";

/**
 * Component responsible for displaying a list of categories, and each's contained courses
 * into the content pane.
 *
 * As a child of ContentPane, itself and all its grades in the list (handled by GradeList)
 * are selectable and it uses the ContentPane's selection management context. The category's
 * header displays a preview pane allowing modification or adding a new grade. The GradeList
 * component will provide its own previewer.
 *
 * In addition, this component must calculate some statistics regarding itself using its
 * contained grades: the number of points out of the category's weight and the corresponding
 * percentage.
 *
 * @typedef Grade
 * @prop {string} uuid
 * @prop {string} item_name
 * @prop {number} item_weight
 * @prop {number} item_mark
 * @prop {number} item_total
 * @prop {string} item_description
 * @prop {string} item_date
 *
 * @typedef Category
 * @prop {string} uuid
 * @prop {string} category_type
 * @prop {number} category_weight
 * @prop {string} category_description
 * @prop {Array<Grade>} category_grade_list
 *
 * @param {{categoryList: Array<Category>}} props
 * @returns
 */
function CategoryList({ categoryList }) {
  // Use context to get information about currenly semester, course.
  const semester = useContext(contextSemester);
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  /* For every category in the category list, convert into JSX using the below code. */
  const categoryListJSX = categoryList.map((category, index) => {
    /*
    Calculate the overall grade (points/weight) and percentage for this category. There
    are probably more efficient ways, but currently blindly iterating through each category's
    grade list, and cumulating the total number of points in the category, and how much of it
    we scored.

    actPoint / maxPoints represents the average of this category. It must be converted into a
    fraction with category weight as denominator.
    */

    // First get the total number of points in this category and how much of those we got.
    // FIXME maybe put in useMemo
    let actPoints = 0; // How many out of the total points we achieved.
    let maxPoints = 0; // Total points in the category
    category.category_grade_list.forEach((grade) => {
      actPoints += (grade.item_mark / grade.item_total) * grade.item_weight;
      maxPoints += grade.item_weight;
    });

    // When clicking the category's banner, modify screen
    const handleClickModify = () => {
      // Preview renderer for a menu to modify the category's info.
      const previewModify = () => {
        // TODO, maybe put in useMemo
        return (
          <div>Previewing modifying {category.category_type} for {course.name}/{semester.name}</div>
        );
      };

      console.log("Selected category " + category.uuid + " : " + category.category_type);
      setSelectedItem({ id: category.uuid, preview: previewModify });
    };

    // When clicking the category's plus, add grade screen
    const handleClickPlus = (e) => {
      // Preview renderer for a menu to add a new grade into the category
      const previewAdd = () => {
        // TODO, maybe put in useMemo
        return (
          <div>Previewing adding a grade to {category.category_type} for {course.name}/{semester.name}</div>
        );
      };

      e.stopPropagation(); //Don't trip handleClickModify
      console.log("Selected category PLUS " + category.uuid + " : " + category.category_type);
      setSelectedItem({ id: category.uuid, preview: previewAdd });
    };

    return (
      <div className="category-item" key={category.uuid}>
        {/* Category header */}
        <div className={`category-header selectable-item ${selectedItem.id === category.uuid ? "selected-item" : ""}`} onClick={handleClickModify}>
          {/* Max width to allow name to expand, min-width to allow name to shrink */}
          <div className="category-header-box">
            <div className="category-header-top">
              <div className="category-name cap-text">{category.category_type}</div>
              <div className="category-weight">
                {floatToDecimalStr((actPoints * category.category_weight) / maxPoints, 1)}/{category.category_weight} (<ColoredPercent number={actPoints / maxPoints} />)
              </div>
            </div>
            <div className="category-description cap-text">{category.category_description}</div>
          </div>
          <img className="content-plus" src={plusIco} alt="Plus icon" onClick={handleClickPlus} title={`Add grade to ${category.category_type}`} />
        </div>

        <div className="horizontal-line" />

        {/* Grades in that category */}
        <GradeList category={{id: category.uuid, name: category.name}} gradeList={category.category_grade_list} />
      </div>
    );
  });

  // Finally, render
  return <div className="category-list thin-scrollbar">{categoryListJSX}</div>;
}

export default CategoryList;
